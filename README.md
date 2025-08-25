# SocialDisruption

# **CSI606-2025-01 - Trabalho Final - Resultados**

## *Discente: Franklin Liesner Tomich*

<!-- Descrever um resumo sobre o trabalho. -->

### Resumo

SocialDisruption é uma rede social simples desenvolvida para o trabalho final de Sistemas Web I. O projeto implementa todas as funcionalidades essenciais de uma plataforma social moderna: cadastro e autenticação de usuários, gerenciamento de perfis, sistema de amizades, publicação de posts e feed de atualizações.

**Tecnologias Utilizadas:**
- **Backend**: Node.js, Express.js, Prisma ORM, SQLite, JWT;
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS);
- **Arquitetura**: RESTful API, MVC (Model-View-Controller), SPA (Single Page Application).

A aplicação oferece uma experiência de usuário intuitiva e responsiva, com interface moderna e funcionalidades básicas de uma rede social real.

### 1. Funcionalidades implementadas
Este projeto implementou as seguintes funcionalidades previstas:

- **Criação de conta e perfil**;
- **Gerenciamento de perfil**;
- **Busca de usuários**;
- **Solicitações de amizades**;
- **Gerenciamento de amizades** (Parcial, através da busca e perfil dos usuários);
- **Publicação de postagens**;
- **Feed de notícias** (Parcial, sem atualização automática).

### 2. Funcionalidades previstas e não implementadas

- **Avatar do usuário**: Não foi implementado o upload e armazenamento de imagens para avatares, como sugerido pelos protótipos iniciais. A opção para adicionar um avatar está presente na interface, mas não realiza o upload da imagem.

- **Gerenciamento de amizades completo**: A funcionalidade de gerenciamento de amizades foi implementada parcialmente. Os usuários podem adicionar, aceitar, recusar e desfazer amizades, mas não há uma interface dedicada para visualizar e gerenciar a lista completa de solicitações.

### 3. Outras funcionalidades implementadas

### 🔧 **Backend:**

---

### **Autenticação e Autorização**
- **Login de usuário** (com JWT token);
- **Autenticação por token** (parcial, apenas para a obtenção do usuário da sessão).

### **Gerenciamento de Usuários**
- **Cadastrar usuário**;
- **Atualizar de usuário**;
- **Excluir de usuário**;
- **Obter usuário da sessão**;
- **Buscar usuário pelo ID**;
- **Buscar usuários por nome** (busca parcial).

### **Sistema de Amizades**
- **Solicitar de amizade**;
- **Aceitar solicitação**;
- **Recusar solicitação**;
- **Desfazer amizade**;
- **Buscar solicitaçãos por ID**;
- **Buscar solicitações por status**.

### **Sistema de Posts**
- **Criar novo post**;
- **Buscar posts por ID do autor**.

---

### 🎨 **Frontend:**

### **Index Inteligente**
- **Página de index** (`index.html`);
- **Redirecionamento automático** (baseado no token armazenado localmente).

### **Sistema de Autenticação**
- **Página de login** (`login.html`);
- **Página de registro** (`register.html`);
- **Validação de email e senha**;
- **Opção "Lembrar-me"** (para persistencia de sessão).

### **Interface Principal**
- **Página principal** (`main.html`) com layout responsivo;
- **Barra superior com campo de busca e dados do usuário logado**
- **Barra lateral com informações de perfil**;
- **Barra lateral com lista de amigos**.

### **Gerenciamento de Posts**
- **Visualização de posts**;
- **Criação de novos posts** (apenas no próprio perfil);
- **Feed de posts** (posts dos amigos).

### **Sistema de Amizades (Interface)**
- **Botões de ação no perfil do usuário** (baseado no status da amizade);
- **Botões de ação nos resultados de busca** (baseado no status da amizade);
- **Diálogos de confirmação** (para ações críticas).

### **Sistema de Busca**
- **Busca de usuários por nome**.

### **Gerenciamento de Perfil**
- **Edição de perfil** (reutiliza página de registro).


### 4. Principais desafios e dificuldades

#### Desafios Técnicos
- **Relacionamentos no Prisma**: Configurar corretamente os relacionamentos complexos entre usuários, amizades e posts no banco de dados.
- **Sistema de Amizades Bidirecional**: Implementar a lógica de amizades que funciona nos dois sentidos (A solicita B ou B solicita A) exigiu cuidado especial nas consultas SQL.
- **Autenticação JWT**: Implementar um sistema seguro de autenticação com tokens, incluindo validação e renovação.

- **Upload de imagens**: Implementar o upload e armazenamento de imagens para avatares dos usuários demonstrou ser mais complexo do que o previsto, ficando de fora do escopo final do projeto.

- **Gerenciamento de Estado no Frontend**: Manter a sincronização entre diferentes componentes da interface sem framework.

#### Desafios de UX/UI
- **Navegação Single Page**: Simular navegação SPA sem frameworks, mantendo a experiência fluida.
- **Interface Responsiva sem Framework**: Criar um design responsivo usando apenas CSS vanilla exigiu planejamento cuidadoso dos layouts.
- **Feedback Visual Dinâmico**: Implementar mudanças de estado visuais (botões de amizade, loading states) sem bibliotecas reativas.

### 5. Instruções para instalação e execução

#### Pré-requisitos
- Node.js
- npm
- Git
- SQLite

#### Passo 1: Clonagem do Repositório
```bash
git clone https://github.com/frantomich/SocialDisruption.git
cd SocialDisruption
```

#### Passo 2: Instalação das Dependências do Backend
```bash
cd backend
npm install
```

#### Passo 3: Configuração do Banco de Dados
```bash
# Configurar variáveis de ambiente (criar arquivo .env)
echo "DATABASE_URL='file:./prisma/SocialDisruption.sqlite'" > .env
echo "JWT_SECRET='seu_jwt_secret_aqui'" >> .env

# Executar migrations do banco
npx prisma migrate dev
```

#### Passo 4: Execução do Backend
```bash
# Ainda no diretório backend
npm start
# A API estará rodando em http://localhost:5000
```

#### Passo 5: Execução do Frontend
```bash
# Em um novo terminal, voltar ao diretório raiz
cd ../frontend

# Servir os arquivos estáticos (usando live-server ou similar)
npx live-server --port=3000
# Ou simpemente abrir o arquivo index.html no navegador
```

### 6. Referências
MOZILLA DEVELOPER NETWORK. **MDN Web Docs**: HTML Reference. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference. Acesso em: 25 ago. 2025.

MOZILLA DEVELOPER NETWORK. **MDN Web Docs**: CSS Reference. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference. Acesso em: 25 ago. 2025.

MOZILLA DEVELOPER NETWORK. **MDN Web Docs**: JavaScript Reference. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference. Acesso em: 25 ago. 2025.

MICROSOFT. **Fluent UI Icons**. Disponível em: https://learn.microsoft.com/en-us/fluent-ui/web-components/icons/. Acesso em: 25 ago. 2025.
