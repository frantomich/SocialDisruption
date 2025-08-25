import { Router } from 'express';
import AuthenticationController from '../controllers/AuthenticationController.js';

const authenticationRouter = Router();
const authenticationController = new AuthenticationController();

authenticationRouter.get('/api/authenticate', authenticationController.authenticate);

export default authenticationRouter;
