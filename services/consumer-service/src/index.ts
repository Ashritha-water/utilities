import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { syncDatabase } from './config/database-init';
import sequelize from './config/database';
import attributeTemplateRoutes from './routes/attribute-template.routes';
import consumerQueryRoutes from './routes/consumer-query.routes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3008;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/attribute-templates', attributeTemplateRoutes);
app.use('/api/consumers', consumerQueryRoutes);



// Initialize database and start server
// syncDatabase().then(() => {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }).catch((error) => {
//   console.error('Failed to start server:', error);
//   process.exit(1);
// });

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }

    app.listen(port, () => {
      console.log(`Consumer service running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer(); 