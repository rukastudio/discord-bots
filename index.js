require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');
const registerCommands = require('./registerCommands.js');
const interactions = require('./interactions.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);

    registerCommands(client);

    console.log(`Bot ID: ${client.user.id}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;


});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        const command = interactions[interaction.commandName];

        if (command) {
            await command(interaction)
        }
    } catch (error) {
        interaction.reply(`Something went wrong while trying to reach Puppy Bot. Try again later`);
    }
});

console.log('test');

client.login(process.env.TOKEN);