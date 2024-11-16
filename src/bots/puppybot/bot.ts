import { ApplicationCommandOptionType, BaseInteraction, ChatInputCommandInteraction, Client, CommandInteraction, GatewayIntentBits, GuildMemberRoleManager, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import { CommandHandler } from './middleware/commandHandler';
import { IBot } from '../../interfaces/IBot';
import '../../config/sequelize';
import { commands } from './commands';

export class Bot implements IBot {
    public client: Client;
    public commands: Record<string, ICommand> = {};

    private token: string;
    private rest: REST;

    constructor(token: string, private commandHandler = new CommandHandler()) {
        this.token = token;
        this.rest = new REST({ version: '10' }).setToken(token);

        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        });

        this.getControllers();
    }

    public run() {
        this.client.once('ready', () => {
            console.log(`Bot logged in as ${this.client.user?.tag}`);

            this.registerCommands();
        });

        this.client.on('interactionCreate', async (interaction: BaseInteraction) => {
            if (!interaction.isCommand()) { return }

            let reply: string;

            try {
                await interaction.deferReply();

                reply = await this.commandHandler.callCommand(this, interaction);
            } catch {
                reply = 'Something went wrong'
            }

            await interaction.editReply(reply + ', woof!')
        });

        this.client.login(this.token).catch(console.error);
    }

    private async registerCommands() {
        const clientId = this.client.user?.id;

        if (!clientId) { return }

        console.log('Started refreshing application (/) commands.');

        this.rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        })
        .then(() => {
            console.log('Successfully reloaded application (/) commands.');
        })
        .catch((error) => {
            console.error(error);
        });
    }

    private getControllers() {
        const controllersDir = join(__dirname, 'controllers');

        const files = readdirSync(controllersDir);

        files.forEach((file) => {
            const controllerPath = join(controllersDir, file);

            import(controllerPath)
                .then((module) => {
                    const constructorName = Object.keys(module)[0];
                    const Controller = module[constructorName];

                    if (Controller) {
                        this.mapCommands(new Controller());
                        console.log(`Loaded controller: ${constructorName}`);
                    } else {
                        console.error(`No valid controller export found in ${constructorName}`);
                    }
                })
                .catch((error) => {
                    console.error(`Error loading controller from ${file}:`, error);
                });
        });
    }

    private mapCommands(Controller: any) {
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
                    } // bind the method to the controller instance
                    console.log(`Mapped command: ${commandName} -> ${methodName}`);
                }
            }
        }
    }

}
