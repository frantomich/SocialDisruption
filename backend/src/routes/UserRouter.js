import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const userRouter = Router();
const userController = new UserController();

// Rotas de Usuário
userRouter.post('/api/user', userController.createUser);
userRouter.get('/api/user/:id', userController.getUser);
userRouter.put('/api/user', userController.updateUser);
userRouter.delete('/api/user', userController.deleteUser);
userRouter.get('/api/session/user', userController.getSessionUser);
userRouter.get('/api/users/find/:name', userController.findUsersByName);

export default userRouter;