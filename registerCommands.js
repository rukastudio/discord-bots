const { REST, Routes } = require('discord.js');
const commands = require('./commands.js');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands(client) {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        )

        console.log('Slash commands were registered successfully!')
    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
}

module.exports = registerCommands;