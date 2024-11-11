import { Client, GatewayIntentBits } from 'discord.js';

export class Bot {
    private client: Client;

    constructor(private token: string) {
        console.log(token);
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        });
    }

    public run() {
        this.client.once('ready', () => {
            console.log(`Bot logged in as ${this.client.user?.tag}`);
        });

        this.client.login(this.token).catch(console.error);
    }
}