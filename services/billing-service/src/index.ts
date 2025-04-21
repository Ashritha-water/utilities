import express from 'express';
import dotenv from 'dotenv';
import billingRoutes from './routes/billing.routes';
import sequelize from './config/database';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/billing', billingRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => console.log(`Billing Service running on port ${PORT}`));
});
