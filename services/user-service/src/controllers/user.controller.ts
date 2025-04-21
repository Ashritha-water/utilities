import { Request, Response } from 'express';
import { User, UserRole, IUser } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';


// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export class UserController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json({
        message: 'Login successful',
        login_url: user.login_url
      });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { username, name, role, utility_id, contact_info } = req.body;

      // Check if username already exists
      const existingUser = await User.findOne({
        where: {
          username
        }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Define login URLs for different roles
      const roleLoginUrls: { [key: string]: string } = {
        admin: 'https://admin.example.com/login',
        manager: 'https://manager.example.com/login',
        user: 'https://user.example.com/login',
        // Add more roles as needed
      };

      // Create user with login URL based on role
      const user = await User.create({
        username,
        name,
        role,
        utility_id,
        contact_info,
        login_url: roleLoginUrls[role] || 'https://default.example.com/login',
        user_id: uuidv4(),
        status: 'active'
      });
      console.log("user", user);

      // Create user role
      const userRole = await UserRole.create({
        user_id: user.user_id,
        role_name: role
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          user_id: user.user_id,
          username: user.username,
          name: user.name,
          role: user.role,
          utility_id: user.utility_id,
          contact_info: user.contact_info,
          status: user.status,
          created_at: user.created_at
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error as Error });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userRoles = await UserRole.find({ user_id: userId });

      res.json({
        user: {
          user_id: user.user_id,
          username: user.username,
          name: user.name,
          role: user.role,
          utility_id: user.utility_id,
          contact_info: user.contact_info,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          roles: userRoles.map((role: any) => ({
            role_name: role.role_name,
            assignedAt: role.assignedAt
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { name, contact_info, status } = req.body;
      const userId = req.user?.user_id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Update user profile and get the updated user
      const [updatedCount, [updatedUser]] = await User.update(
        { name, contact_info, status },
        { 
          where: { user_id: userId }, 
          returning: true 
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          name: updatedUser.name,
          role: updatedUser.role,
          utility_id: updatedUser.utility_id,
          contact_info: updatedUser.contact_info,
          status: updatedUser.status,
          created_at: updatedUser.created_at
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error });
    }
  }
}
