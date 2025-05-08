import express from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/request-otp', userController.requestOTP);
router.post('/verify-otp', userController.verifyOTP);

// Protected routes
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.put('/password', verifyToken, userController.updatePassword);
router.post('/logout', verifyToken, userController.logout);

// Role management routes
router.post('/roles', verifyToken, userController.createRole);
router.put('/roles/:roleId', verifyToken, userController.updateRole);
router.delete('/roles/:roleId', verifyToken, userController.deleteRole);
router.get('/roles', verifyToken, userController.getRoles);

export { router as userRoutes };
