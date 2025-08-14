import { prisma } from "../database/client.js";

export default class PostController {
    async createPost(request, response) {
        const { author, content } = request.body;

        // Verifica se as entradas estão presentes:
        if (!author || !content) {
            return response.status(400).json({ message: "Author and content are required!", post: null });
        }

        try {
            // Cria um novo post:
            const newPost = await prisma.post.create({
                data: {
                    author,
                    content
                }
            });

            // Retorna o post criado:
            return response.status(201).json({ message: "Post created successfully!", post: newPost });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", post: null });
        }
    }

    async getPosts(request, response) {
        const { author } = request.body;

        // Verifica se o autor está presente:
        if (!author) {
            return response.status(400).json({ message: "Author is required!", posts: null });
        }

        try {
            // Busca os posts do autor:
            const posts = await prisma.post.findMany({
                where: { author },
                orderBy: { created_at: 'desc' }
            });

            // Verifica se existem posts:
            if (posts.length === 0) {
                return response.status(404).json({ message: "No posts found for this author!", posts: null }); 
            }

            // Retorna os posts encontrados:
            return response.status(200).json({ message: "Posts found!", posts });

        } catch (error) {
            console.error("Internal server error:", error);
            return response.status(500).json({ message: "Internal server error!", posts: null });
        }
    }
}