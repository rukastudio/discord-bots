import { Client } from "discord.js";

export interface IBot {
    commands: Record<string, ICommand>;
    client: Client;
    run(): void;
}