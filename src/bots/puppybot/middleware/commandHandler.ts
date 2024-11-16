import { ApplicationCommandOptionType, BaseInteraction, ChatInputCommandInteraction, CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { UserDatabase } from "../data/databases/userDatabase";
import { IBot } from "../../../interfaces/IBot";

export class CommandHandler {
    constructor(private userDatabase = new UserDatabase()) { }

    public async callCommand(bot: IBot, interaction: CommandInteraction): Promise<string> {
        const member = interaction.member;

        if (!member) {
            throw Error();
        }

        if (!bot.client.user) {
            throw Error();
        }

        const args = [];

        for (const option of interaction.options.data) {
            if (option.type === ApplicationCommandOptionType.User && typeof (option.value) === 'string') {
                const user = await this.userDatabase.getUser(option.value);

                args.push(user);
            } else {
                args.push(option.value);
            }
        }
        
        const command = bot.commands[interaction.commandName];
        const commandMethod = command.controller[command.methodName];

        if (!commandMethod) {
            throw new Error("Command does not have a method.");
        }

        const botUser = await this.userDatabase.getUser(bot.client.user.id);
        const user = await this.userDatabase.getUser(member.user.id);

        // Check for role-based authorization
        const authorizeRoles: string[] = Reflect.getMetadata("authorizeRoles", command.controller, command.methodName) || [];
        if (authorizeRoles.length > 0) {
            const userRoles = member.roles instanceof GuildMemberRoleManager && member.roles.cache; // Assuming `roles` holds the user's roles
            if (userRoles && !authorizeRoles.some(role => userRoles.has(role))) {
                return "You do not have the required role to execute this command";
            }
        }

        // Check for name-based authorization
        const authorizeUsers: string[] = Reflect.getMetadata("authorizeUsers", command.controller, command.methodName) || [];

        if (authorizeUsers.length > 0 && !authorizeUsers.includes(member.user.id)) {
            return "You are not authorized to execute this command";
        }

        return await commandMethod(botUser, user, ...args);
    }
}