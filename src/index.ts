import { Client, IntentsBitField } from 'discord.js';

const client: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

client.on('messageCreate', (message) => {
    console.log(message)
});

client.login('MTI3NDQ4MTIxMjI5NTIyMTI4MA.GT1LgD.65mQwTam_Y7A8-JfN83CQH1AfFK8GPkh2ngFrM');