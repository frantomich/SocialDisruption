import { Router } from 'express';
import LoginController from '../controllers/LoginController.js';

const loginRouter = Router();
const loginController = new LoginController();

// Rota de autenticação
loginRouter.post('/api/login', loginController.authenticate);

export default loginRouter;