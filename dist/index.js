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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const botsFolder = path_1.default.join(__dirname, 'bots');
function runBot(botFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env[`${botFolder.toUpperCase()}_TOKEN`];
        if (!token) {
            throw new Error(`Token for ${botFolder} not found.`);
        }
        const botPath = path_1.default.join(botsFolder, botFolder, 'bot.js');
        const { Bot } = yield Promise.resolve(`${botPath}`).then(s => __importStar(require(s)));
        const bot = new Bot(token);
        bot.run();
    });
}
function runBots() {
    return __awaiter(this, void 0, void 0, function* () {
        const botFolders = fs_1.default.readdirSync(botsFolder).filter(file => fs_1.default.statSync(path_1.default.join(botsFolder, file)).isDirectory());
        for (const botFolder of botFolders) {
            try {
                yield runBot(botFolder);
                console.log(`Successfully started bot in folder: ${botFolder}`);
            }
            catch (error) {
                console.error(`Failed to start bot in folder ${botFolder}:`, error);
            }
        }
    });
}
runBots().catch(console.error);
