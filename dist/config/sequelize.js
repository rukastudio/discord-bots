"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/database.ts
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load environment variables from .env
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DATABASE_NAME, // Database name from .env
    username: process.env.DATABASE_USERNAME, // Database username from .env
    password: process.env.DATABASE_PASSWORD, // Database password from .env
    host: process.env.DATABASE_HOST, // Database host from .env
    port: Number(process.env.DATABASE_PORT), // Database port from .env
    dialect: 'mysql', // or 'mysql', 'mariadb', etc.
});
const botsFolder = (0, path_1.join)(__dirname, '../bots'); // This points to 'src/bots'
const botFolders = fs_1.default.readdirSync(botsFolder).filter(file => fs_1.default.statSync(path_1.default.join(botsFolder, file)).isDirectory());
for (const botFolder of botFolders) {
    const modelsFolder = path_1.default.join(botsFolder, botFolder, 'data', 'models');
    const modelFiles = fs_1.default.readdirSync(modelsFolder).filter(file => file.endsWith('.js')); // Or '.js' if transpiled
    modelFiles.forEach(file => {
        // Dynamically require the model file and add to Sequelize models
        const module = require(path_1.default.join(modelsFolder, file));
        const constructorName = Object.keys(module)[0];
        const model = module[constructorName]; // Use `.default` for ES modules
        sequelize.addModels([model]); // Add model to Sequelize
    });
}
sequelize.sync()
    .then(() => console.log('Database synced!'))
    .catch((error) => console.error('Error syncing the database:', error));
exports.default = sequelize;
