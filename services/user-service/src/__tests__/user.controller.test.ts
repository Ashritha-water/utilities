import { UserController } from '../controllers/user.controller';
import { Request, Response } from 'express';
import { User, UserRole, LoginHistory } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockUser = new User({
    user_id: 'test-user-id',
    username: 'existinguser',
    name: 'Existing User',
    role: 'user',
    login_url: 'http://localhost:3000/login', // Add this line
    utility_id: 'test-utility',
    contact_info: {
      email: 'existing@example.com'
    },
    password: 'password123',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  });

describe('UserController', () => {
  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    userController = new UserController();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });
/* 
  describe('requestOTP', () => {
    it('should send OTP to email', async () => {
      req.body = {
        identifier: 'test@example.com',
        type: 'email'
      };

      await userController.requestOTP(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'OTP sent successfully' });
    });

    it('should send OTP to phone', async () => {
      req.body = {
        identifier: '+1234567890',
        type: 'phone'
      };

      await userController.requestOTP(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'OTP sent successfully' });
    });

    it('should return error for invalid type', async () => {
      req.body = {
        identifier: 'test@example.com',
        type: 'invalid'
      };

      await userController.requestOTP(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid type' });
    });
  });

  describe('verifyOTP', () => {
    it('should verify valid OTP', async () => {
      req.body = {
        identifier: 'test@example.com',
        otp: '123456'
      };

      await userController.verifyOTP(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'OTP verified successfully' });
    });

    it('should return error for invalid OTP', async () => {
      req.body = {
        identifier: 'test@example.com',
        otp: 'invalid'
      };

      await userController.verifyOTP(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired OTP' });
    });
  }); */

  describe('register', () => {
    it('should register new user successfully', async () => {
      req.body = {
        username: 'newuser',
        name: 'New User',
        role: 'user',
        utility_id: 'test-utility',
        contact_info: {
          email: 'new@example.com'
        },
        password: 'password123'
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockResolvedValue(mockUser);
      jest.spyOn(UserRole, 'create').mockResolvedValue({});

      await userController.register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          user_id: mockUser.user_id,
          username: mockUser.username,
          name: mockUser.name,
          role: mockUser.role,
          utility_id: mockUser.utility_id,
          contact_info: mockUser.contact_info,
          status: mockUser.status,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at
        }
      });
    });

    it('should return error for existing username', async () => {
      req.body = {
        username: 'existinguser',
        name: 'Existing User',
        role: 'user',
        utility_id: 'test-utility',
        contact_info: {
          email: 'existing@example.com'
        },
        password: 'password123'
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      await userController.register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists' });
    });

    it('should return error for missing contact info', async () => {
      req.body = {
        username: 'newuser',
        name: 'New User',
        role: 'user',
        utility_id: 'test-utility',
        contact_info: {},
        password: 'password123'
      };

      await userController.register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'At least one contact method (email or phone) is required'
      });
    });
  });

  describe('login', () => {
 /*    it('should login with email', async () => {
        req.body = {
          identifier: 'test@example.com',
          password: 'password123',
          type: 'email'
        };
      
        // Set up request object with headers and socket
        (req as any).headers = {
          'x-forwarded-for': '127.0.0.1',
          'user-agent': 'test-agent'
        };
        (req as any).socket = {
          remoteAddress: '127.0.0.1'
        };
      
        // Mock the User model
        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        
        // Mock bcrypt compare
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
        
        // Mock jwt sign
        jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options) => {
          return 'test-token';
        });
        
        // Mock LoginHistory
        jest.spyOn(LoginHistory, 'create').mockImplementation(() => Promise.resolve({
          id: 1,
          user_id: mockUser.user_id,
          ip_address: '127.0.0.1',
          user_agent: 'test-agent',
          login_at: new Date(),
          success: true
        }));
      
        // Mock the response object methods
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
      
        await userController.login(req as Request, res as Response);
      
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Login successful',
          token: 'test-token',
          user: {
            user_id: mockUser.user_id,
            username: mockUser.username,
            name: mockUser.name,
            role: mockUser.role,
            utility_id: mockUser.utility_id,
            contact_info: mockUser.contact_info,
            status: mockUser.status,
            created_at: mockUser.created_at,
            updated_at: mockUser.updated_at
          }
        });
      }); */

    it('should return error for invalid credentials', async () => {
      req.body = {
        identifier: 'invalid@example.com',
        password: 'wrongpassword',
        type: 'email'
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await userController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});
