import express from 'express';
import dotenv from 'dotenv';
import  sequelize from './config/database';
import { userRoutes } from './routes/user.routes';
import { User, UserRole } from './models/user.model';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);



// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    
    // Sync both models with the database
    return sequelize.sync({
      alter: true,
      force: process.env.NODE_ENV === 'development'
    })
    .then(() => {
      console.log('Database synchronization completed');
    });
  })
  .then(() => {
    console.log('Database synchronized successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection or sync error:', error);
    process.exit(1);
  });
