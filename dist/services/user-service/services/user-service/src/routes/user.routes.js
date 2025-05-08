"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
exports.userRoutes = router;
const userController = new user_controller_1.UserController();
// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/request-otp', userController.requestOTP);
router.post('/verify-otp', userController.verifyOTP);
// Protected routes
router.get('/profile', auth_middleware_1.verifyToken, userController.getProfile);
router.put('/profile', auth_middleware_1.verifyToken, userController.updateProfile);
router.put('/password', auth_middleware_1.verifyToken, userController.updatePassword);
router.post('/logout', auth_middleware_1.verifyToken, userController.logout);
// Role management routes
router.post('/roles', auth_middleware_1.verifyToken, userController.createRole);
router.put('/roles/:roleId', auth_middleware_1.verifyToken, userController.updateRole);
router.delete('/roles/:roleId', auth_middleware_1.verifyToken, userController.deleteRole);
router.get('/roles', auth_middleware_1.verifyToken, userController.getRoles);
