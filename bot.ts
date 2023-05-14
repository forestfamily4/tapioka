import { baseManager } from "./manager/base";
import { config } from "./lib/config";
import { Client, GatewayIntentBits } from "discord.js";
import { commandManager } from "./manager/commands";
import { eventManager } from "./manager/events";
import { Server } from "./lib/server";

export class Bot {
    private commandManager: commandManager
    private eventManager: eventManager
    public client: Client
    private server: Server;

    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        });


        this.commandManager = new commandManager(this)
        this.eventManager = new eventManager(this)

        this.client.login(config.token)
        this.server = new Server().start(3030)
    }

    public async reload(){
        this.commandManager.reload()
        this.eventManager.reload()
    }
}