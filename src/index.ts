import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { IBot } from './interfaces/IBot';

dotenv.config();

const botsFolder: string = path.join(__dirname, 'bots');

async function runBot(botFolder: string) {
    const token = process.env[`${botFolder.toUpperCase()}_TOKEN`];

    if (!token) {
        throw new Error(`Token for ${botFolder} not found.`);
    }

    const botPath = path.join(botsFolder, botFolder, 'bot.js');
    const { Bot } = await import(botPath);

    const bot: IBot = new Bot(token);
    bot.run();
}

async function runBots() {
    const botFolders = fs.readdirSync(botsFolder).filter(file =>
        fs.statSync(path.join(botsFolder, file)).isDirectory()
    );

    for (const botFolder of botFolders) {
        try {
            await runBot(botFolder);
            console.log(`Successfully started bot in folder: ${botFolder}`);
        } catch (error) {
            console.error(`Failed to start bot in folder ${botFolder}:`, error);
        }
    }
}

runBots().catch(console.error);
