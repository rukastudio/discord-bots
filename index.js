const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const query = require('./query.js');

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

    client.guilds.cache.forEach(guild => {
        console.log(`${guild.name} | ${guild.id}`);
    });

    console.log(`bot id: ${client.use.id}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;


});

client.login(process.env.TOKEN);

try {
    const results = await query('SELECT * FROM User');

    console.log(results);
} catch (error) {
    console.log(error);
};

// const rest = new REST({ version: '14.15.3' }).setToken(process.env.TOKEN);

// try {
//     await rest.put(
//         Routes.applicationGuildCommands(client.user.id)
//     )
// } catch (error) {
//     console.log(`There was an error: ${error}`)
// }