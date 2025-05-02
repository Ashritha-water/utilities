require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const models = require('./models');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection

// Sync all models with the database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 