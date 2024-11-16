"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
class Router {
    constructor(commands) {
        this.commands = commands;
    }
    getCommand(commandName) {
        for (const command of this.commands) {
            if (command.name === commandName) {
                return command;
            }
        }
        return null;
    }
    addCommand(commandName, callback) {
        const command = this.getCommand(commandName);
        if (!command) {
            return;
        }
    }
}
exports.Router = Router;
