import { baseManager } from "./manager/base";
import { config } from "./lib/config";
import { Client, GatewayIntentBits } from "discord.js";
import { commandManager } from "./manager/commands";
import { eventManager } from "./manager/events";

export class Bot {
    private commandManager: commandManager
    private eventManager: eventManager
    private client: Client

    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        });

        this.commandManager = new commandManager(this.client)
        this.eventManager = new eventManager(this.client)
        
        this.client.login(config.token)
    }
}