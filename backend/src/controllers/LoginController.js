import { prisma } from "../database/client.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default class LoginController {
    // Autentica um usuário e gera um token JWT:
    async login(request, response) {
        const { email, password, remember } = request.body;

        // Verifica se as entradas estão presentes:
        if (!email || !password) {
            return response.status(400).json({ message: "E-mail and password are required!", token: null });
        }

        try {
            // Busca o usuário pelo e-mail:
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password: true
                }
            });

            // Verifica se o usuário existe e se a senha está correta:
            if (!user || (user.password !== password)) {
                return response.status(401).json({ message: "Invalid e-mail or password!", token: null });
            }

            // Gera o token JWT:
            const expiresIn = remember ? "30d" : "1h";
            const token = jwt.sign({id: user.id }, JWT_SECRET, { expiresIn });

            // Se a autenticação for bem-sucedida, retorna o token de acesso:
            return response.status(200).json({ message: "Authentication successful!", token: token });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", token: null });
        }
    }
}