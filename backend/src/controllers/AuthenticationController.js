import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default class AuthenticationController {
    // Autentica um usuário via token JWT:
    async authenticate(request, response) {
        const token = request.headers.authorization;

        if (!token) {
            return response.status(401).json({ message: 'Token are required!', id: null });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return response.status(200).json({ message: 'Authentication successful!', id: decoded.id });
        } catch (error) {
            return response.status(401).json({ message: 'Authentication failed!', id: null });
        }
    }
}
