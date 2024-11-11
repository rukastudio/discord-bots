"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/database.ts
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DATABASE_NAME, // Database name from .env
    username: process.env.DATABASE_USERNAME, // Database username from .env
    password: process.env.DATABASE_PASSWORD, // Database password from .env
    host: process.env.DATABASE_HOST, // Database host from .env
    port: Number(process.env.DATABASE_PORT), // Database port from .env
    dialect: 'mysql', // or 'mysql', 'mariadb', etc.
    models: [path_1.default.join(__dirname, "../bots/**/models/*.ts")], // Load models
});
exports.default = sequelize;
