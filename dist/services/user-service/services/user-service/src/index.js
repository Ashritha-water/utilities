"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const user_routes_1 = require("./routes/user.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3005;
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/api/users', user_routes_1.userRoutes);
// Database connection
database_1.default.authenticate()
    .then(() => {
    console.log('Connected to PostgreSQL database');
    // Sync both models with the database
    return database_1.default.sync({
        alter: true,
        // force: process.env.NODE_ENV === 'development'
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
    .catch((error) => {
    console.error('Database connection or sync error:', error);
    process.exit(1);
});
