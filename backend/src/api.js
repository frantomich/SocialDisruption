import express from 'express';
import cors from 'cors';
import LoginController from './controllers/LoginController.js';
import UserController from './controllers/UserController.js';
import FriendshipController from './controllers/FriendshipController.js';
import PostController from './controllers/PostController.js';

const api = express();
const port = 3000;

api.use(cors());
api.use(express.json());

const loginController = new LoginController();
const userController = new UserController();
const postController = new PostController();
const friendshipController = new FriendshipController();

// Rotas
api.post('/api/login', loginController.authenticate);

// Rotas de Usuário
api.post('/api/user', userController.createUser);
api.get('/api/user', userController.getUser);
api.put('/api/user', userController.updateUser);
api.delete('/api/user', userController.deleteUser);

// Rotas de Post
api.post('/api/post', postController.createPost);
api.get('/api/posts', postController.getPosts);

// Rotas de Amizade
api.post('/api/friendship', friendshipController.requestFriendship);
api.get('/api/friendship', friendshipController.getFriendship);
api.put('/api/friendship/accept', friendshipController.acceptFriendship);
api.put('/api/friendship/decline', friendshipController.declineFriendship);
api.put('/api/friendship/undo', friendshipController.undoFriendship);
api.get('/api/friends', friendshipController.getFriends);

api.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
