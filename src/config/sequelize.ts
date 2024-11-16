// src/config/database.ts
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path, { join } from "path";
import fs, { readdirSync, statSync } from 'fs';

// Load environment variables from .env
dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,          // Database name from .env
    username: process.env.DATABASE_USERNAME,          // Database username from .env
    password: process.env.DATABASE_PASSWORD,      // Database password from .env
    host: process.env.DATABASE_HOST,              // Database host from .env
    port: Number(process.env.DATABASE_PORT),      // Database port from .env
    dialect: 'mysql',                          // or 'mysql', 'mariadb', etc.
});

const botsFolder = join(__dirname, '../bots'); // This points to 'src/bots'

const botFolders = fs.readdirSync(botsFolder).filter(file =>
    fs.statSync(path.join(botsFolder, file)).isDirectory()
);

for (const botFolder of botFolders) {
    const modelsFolder = path.join(botsFolder, botFolder, 'data', 'models');

    const modelFiles = fs.readdirSync(modelsFolder).filter(file => file.endsWith('.js')); // Or '.js' if transpiled

    modelFiles.forEach(file => {
        // Dynamically require the model file and add to Sequelize models
        const module = require(path.join(modelsFolder, file))
        const constructorName = Object.keys(module)[0];
        const model = module[constructorName]; // Use `.default` for ES modules
        sequelize.addModels([model]); // Add model to Sequelize
    });
}

sequelize.sync()
    .then(() => console.log('Database synced!'))
    .catch((error) => console.error('Error syncing the database:', error));

export default sequelize;
