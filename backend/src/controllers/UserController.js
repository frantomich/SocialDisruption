import { prisma } from "../database/client.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default class UserController {
    // Cria um novo usuário:
    async createUser(request, response) {
        const {email, password, name, lastname, avatar, birthday, country, relationship} = request.body;
        
        // Verifica se as entradas estão presentes:
        if (!email || !password || !name || !lastname || !birthday || !country || !relationship) {
            return response.status(400).json({ message: "All fields are required!", user: null });
        }

        try {
            // Verifica se o usuário já existe:
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return response.status(409).json({ message: "User already exists!", user: null });
            }

            // Cria um novo usuário:
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password,
                    name,
                    lastname,
                    avatar,
                    birthday,
                    country,
                    relationship
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    avatar: true,
                    birthday: true,
                    country: true,
                    relationship: true
                }
            });
            
            // Retorna o usuário criado:
            return response.status(201).json({ message: "User created successfully!", user: newUser });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", user: null });
        }
    }

    // Busca um usuário pelo ID:
    async getUser(request, response) {
        const { id } = request.params;

        // Verifica se o e-mail está presente:
        if (!id) {
            return response.status(400).json({ message: "User ID is required!", user: null });
        }

        try {
            // Busca o usuário pelo ID:
            const user = await prisma.user.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    avatar: true,
                    birthday: true,
                    country: true,
                    relationship: true
                }
            });
            
            // Verifica se o usuário existe:
            if (!user) {
                return response.status(404).json({ message: "User not found!", user: null });
            }

            // Retorna o usuário encontrado:
            return response.status(200).json({ message: "User found!", user });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", user: null });
        }
    }

    // Atualiza um usuário:
    async updateUser(request, response) {
        const { id, email, name, lastname, avatar, birthday, country, relationship } = request.body;

        // Verifica se o e-mail está presente:
        if (!id || !email || !name || !lastname || !birthday || !country || !relationship) {
            return response.status(400).json({ message: "All fields are required!", user: null });
        }

        try {
            // Atualiza o usuário:
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    id,
                    name,
                    lastname,
                    avatar,
                    birthday,
                    country,
                    relationship
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    avatar: true,
                    birthday: true,
                    country: true,
                    relationship: true
                }
            });

            // Retorna o usuário atualizado:
            return response.status(200).json({ message: "User updated successfully!", user: updatedUser });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", user: null });
        }
    }
    
    // Exclui um usuário:
    async deleteUser(request, response) {
        const { id } = request.body;

        // Verifica se o e-mail está presente:
        if (!id) {
            return response.status(400).json({ message: "User ID is required!", user: null });
        }

        try {
            // Exclui o usuário:
            const deletedUser = await prisma.user.delete({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    avatar: true,
                    birthday: true,
                    country: true,
                    relationship: true
                }
            });

            // Retorna uma mensagem de sucesso:
            return response.status(200).json({ message: "User deleted successfully!", user: deletedUser });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", user: null });
        }
    }

    // Busca o usuário da sessão atual:
    async getSessionUser(request, response) {
        const token = request.headers.authorization;
        
        // Verifica se o token está presente:
        if (!token) {
            return response.status(401).json({ message: "Token is missing!", user: null });
        }

        try {
            // Decodifica o token:
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Busca o usuário pelo ID:
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    avatar: true,
                    birthday: true,
                    country: true,
                    relationship: true
                }
            });

            // Verifica se o usuário existe:
            if (!user) {
                return response.status(404).json({ message: "User not found!", user: null });
            }

            // Retorna o usuário encontrado:
            return response.status(200).json({ message: "User found!", user });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", user: null });
        }
    }

    // Busca usuários pelo nome:
    async findUsersByName(request, response) {
        const { name } = request.params;

        // Verifica se o nome está presente:
        if (!name) {
            return response.status(400).json({ message: "Name is required!", users: [] });
        }

        try {
            // Busca usuários pelo nome:
            const users = await prisma.user.findMany({
                where: {
                    name: {
                        contains: name
                    }
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    avatar: true,
                    birthday: true,
                    country: true,
                    relationship: true
                }
            });

            // Retorna os usuários encontrados:
            return response.status(200).json({ message: "Users found!", users });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", users: [] });
        }
    }
}