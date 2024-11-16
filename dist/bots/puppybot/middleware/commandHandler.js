"use strict";
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
exports.CommandHandler = void 0;
const discord_js_1 = require("discord.js");
const userDatabase_1 = require("../data/databases/userDatabase");
class CommandHandler {
    constructor(userDatabase = new userDatabase_1.UserDatabase()) {
        this.userDatabase = userDatabase;
    }
    callCommand(bot, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = interaction.member;
            if (!member) {
                throw Error();
            }
            if (!bot.client.user) {
                throw Error();
            }
            const args = [];
            for (const option of interaction.options.data) {
                if (option.type === discord_js_1.ApplicationCommandOptionType.User && typeof (option.value) === 'string') {
                    const user = yield this.userDatabase.getUser(option.value);
                    args.push(user);
                }
                else {
                    args.push(option.value);
                }
            }
            const command = bot.commands[interaction.commandName];
            const commandMethod = command.controller[command.methodName];
            if (!commandMethod) {
                throw new Error("Command does not have a method.");
            }
            const botUser = yield this.userDatabase.getUser(bot.client.user.id);
            const user = yield this.userDatabase.getUser(member.user.id);
            // Check for role-based authorization
            const authorizeRoles = Reflect.getMetadata("authorizeRoles", command.controller, command.methodName) || [];
            if (authorizeRoles.length > 0) {
                const userRoles = member.roles instanceof discord_js_1.GuildMemberRoleManager && member.roles.cache; // Assuming `roles` holds the user's roles
                if (userRoles && !authorizeRoles.some(role => userRoles.has(role))) {
                    return "You do not have the required role to execute this command";
                }
            }
            // Check for name-based authorization
            const authorizeUsers = Reflect.getMetadata("authorizeUsers", command.controller, command.methodName) || [];
            if (authorizeUsers.length > 0 && !authorizeUsers.includes(member.user.id)) {
                return "You are not authorized to execute this command";
            }
            return yield commandMethod(botUser, user, ...args);
        });
    }
}
exports.CommandHandler = CommandHandler;
