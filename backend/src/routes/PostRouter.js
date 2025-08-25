import { Router } from 'express';
import PostController from '../controllers/PostController.js';

const postRouter = Router();
const postController = new PostController();

// Rotas de Post
postRouter.post('/api/post', postController.createPost);
postRouter.get('/api/posts/:author', postController.getPosts);

export default postRouter;