import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
const userController = new UserController();

router.post('/register', userController.register);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

export { router as userRoutes };
