// src/config/database.ts
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env
dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,          // Database name from .env
    username: process.env.DATABASE_USERNAME,          // Database username from .env
    password: process.env.DATABASE_PASSWORD,      // Database password from .env
    host: process.env.DATABASE_HOST,              // Database host from .env
    port: Number(process.env.DATABASE_PORT),      // Database port from .env
    dialect: 'mysql',                          // or 'mysql', 'mariadb', etc.
    models: [path.join(__dirname, "../bots/**/models/*.ts")], // Load models
});

export default sequelize;
