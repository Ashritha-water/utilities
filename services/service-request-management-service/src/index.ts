import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { sequelize } from './config/database';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/', routes);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    app.listen(port, () => {
      console.log('service request management service running on port ' + port);
    });
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });
