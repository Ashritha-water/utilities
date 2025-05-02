import express from 'express';
import dotenv from 'dotenv';
import billingRoutes from './routes/billing.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/billing', billingRoutes);

const PORT = process.env.PORT || 4000;


