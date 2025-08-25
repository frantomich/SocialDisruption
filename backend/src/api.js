import express from 'express';
import cors from 'cors';
import loginRouter from './routes/LoginRouter.js';
import userRouter from './routes/UserRouter.js';
import friendshipRouter from './routes/FriendshipRouter.js';
import postRouter from './routes/PostRouter.js';
import authenticationRouter from './routes/AuthenticationRouter.js';

const api = express();
const port = 5000;

api.use(cors());
api.use(express.json());

// Rotas
api.use(loginRouter);
api.use(userRouter);
api.use(friendshipRouter);
api.use(postRouter);
api.use(authenticationRouter);

// Iniciar API
api.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
