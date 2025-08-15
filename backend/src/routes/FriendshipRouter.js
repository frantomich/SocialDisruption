import { Router } from 'express';
import FriendshipController from '../controllers/FriendshipController.js';

const friendshipRouter = Router();
const friendshipController = new FriendshipController();

// Rotas de Amizade
friendshipRouter.post('/api/friendship', friendshipController.requestFriendship);
friendshipRouter.get('/api/friendship', friendshipController.getFriendship);
friendshipRouter.put('/api/friendship/accept', friendshipController.acceptFriendship);
friendshipRouter.put('/api/friendship/decline', friendshipController.declineFriendship);
friendshipRouter.put('/api/friendship/undo', friendshipController.undoFriendship);
friendshipRouter.get('/api/friends', friendshipController.getFriends);

export default friendshipRouter;