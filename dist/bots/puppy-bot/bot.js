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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
require("reflect-metadata");
const commandHandler_1 = require("./middleware/commandHandler");
require("../../config/sequelize");
const commands_1 = require("./commands");
class Bot {
    constructor(token, commandHandler = new commandHandler_1.CommandHandler()) {
        this.commandHandler = commandHandler;
        this.commands = {};
        this.token = token;
        this.rest = new discord_js_1.REST({ version: '10' }).setToken(token);
        this.client = new discord_js_1.Client({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
        });
        this.getControllers();
    }
    run() {
        this.client.once('ready', () => {
            var _a;
            console.log(`Bot logged in as ${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
            this.registerCommands();
        });
        this.client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isCommand()) {
                return;
            }
            let reply;
            try {
                yield interaction.deferReply();
                reply = yield this.commandHandler.callCommand(this, interaction);
            }
            catch (_a) {
                reply = 'Something went wrong';
            }
            yield interaction.editReply(reply + ', woof!');
        }));
        this.client.login(this.token).catch(console.error);
    }
    registerCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const clientId = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!clientId) {
                return;
            }
            console.log('Started refreshing application (/) commands.');
            this.rest.put(discord_js_1.Routes.applicationCommands(clientId), {
                body: commands_1.commands,
            })
                .then(() => {
                console.log('Successfully reloaded application (/) commands.');
            })
                .catch((error) => {
                console.error(error);
            });
        });
    }
    getControllers() {
        const controllersDir = (0, path_1.join)(__dirname, 'controllers');
        const files = (0, fs_1.readdirSync)(controllersDir);
        files.forEach((file) => {
            const controllerPath = (0, path_1.join)(controllersDir, file);
            Promise.resolve(`${controllerPath}`).then(s => __importStar(require(s))).then((module) => {
                const constructorName = Object.keys(module)[0];
                const Controller = module[constructorName];
                if (Controller) {
                    this.mapCommands(new Controller());
                    console.log(`Loaded controller: ${constructorName}`);
                }
                else {
                    console.error(`No valid controller export found in ${constructorName}`);
                }
            })
                .catch((error) => {
                console.error(`Error loading controller from ${file}:`, error);
            });
        });
    }
    mapCommands(Controller) {
        const prototype = Object.getPrototypeOf(Controller);
        // Iterate over the methods in the prototype
        for (const methodName of Object.getOwnPropertyNames(prototype)) {
            // Only consider methods (functions)
            if (typeof prototype[methodName] === 'function' && methodName !== 'constructor') {
                const commandName = Reflect.getMetadata('commandName', Controller, methodName);
                if (commandName) {
                    // Add the method to the commands map with the command name as the key
                    this.commands[commandName] = {
                        controller: Controller,
                        methodName: methodName
                    }; // bind the method to the controller instance
                    console.log(`Mapped command: ${commandName} -> ${methodName}`);
                }
            }
        }
    }
}
exports.Bot = Bot;
