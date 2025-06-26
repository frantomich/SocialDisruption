-- SocialDisruption application database structure definition script.
-- WARNING: Running this will erase and rebuild the database!

DROP SCHEMA IF EXISTS SocialDisruption;

CREATE SCHEMA SocialDisruption;

USE SocialDisruption;

-- Cria a tabela que armazena os dados de login e perfil dos usuários:
CREATE TABLE Usuario (
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255) NOT NULL,
    foto_perfil BLOB,
    genero ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    data_nascimento DATE NOT NULL,
    nacionalidade ENUM('BR', 'PT', 'US') NOT NULL,
    status_relacionamento ENUM('Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'Enrolado(a)') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (email),
    CHECK (data_nascimento <= CURDATE())
);

-- Cria a tabela que armazena as relações de amizade entre os usuários:
CREATE TABLE Amizade (
    usuario_solicitante VARCHAR(255) NOT NULL,
    usuario_solicitado VARCHAR(255) NOT NULL,
    status ENUM('Pendente', 'Aceito', 'Recusado') NOT NULL,
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_confirmacao TIMESTAMP,
    PRIMARY KEY (usuario_solicitante, usuario_solicitado),
    FOREIGN KEY (usuario_solicitante) REFERENCES Usuario(email) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (usuario_solicitado) REFERENCES Usuario(email) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (data_confirmacao >= data_solicitacao)
);

-- Cria a tabela que armazena as postagens feitas pelos usuários:
CREATE TABLE Postagem (
    id INT AUTO_INCREMENT NOT NULL,
    usuario VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario) REFERENCES Usuario(email) ON DELETE CASCADE ON UPDATE CASCADE
);
