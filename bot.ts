import { config } from "./lib/config.js";
import { Client, GatewayIntentBits } from "discord.js";
import { commandManager } from "./manager/commands.js";
import { eventManager } from "./manager/events.js";
import { Server } from "./lib/server.js";

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

        this.server = new Server().start(3030)
    }

    public async reload(){        
        this.client.login(config.token)
        this.commandManager.reload()
        this.eventManager.reload()
    }

    
}