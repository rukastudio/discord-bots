"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
class Bot {
    constructor(token) {
        this.token = token;
        console.log(token);
        this.client = new discord_js_1.Client({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
        });
    }
    run() {
        this.client.once('ready', () => {
            var _a;
            console.log(`Bot logged in as ${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
        });
        this.client.login(this.token).catch(console.error);
    }
}
exports.Bot = Bot;
