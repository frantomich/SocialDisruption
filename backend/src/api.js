import express from 'express';
import cors from 'cors';
import loginRouter from './routes/LoginRouter.js';
import userRouter from './routes/UserRouter.js';
import friendshipRouter from './routes/FriendshipRouter.js';
import postRouter from './routes/PostRouter.js';

const api = express();
const port = 3000;

api.use(cors());
api.use(express.json());

// Rotas
api.use(loginRouter);
api.use(userRouter);
api.use(friendshipRouter);
api.use(postRouter);

// Iniciar API
api.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
