import { config } from "./lib/config.js";
import { Client, GatewayIntentBits } from "discord.js";
import { commandManager } from "./manager/commands.js";
import { eventManager } from "./manager/events.js";
import { Server } from "./lib/server.js";
import { buttonManager } from "./manager/buttons.js";

export class Bot {
    private commandManager: commandManager
    private eventManager: eventManager
    public client: Client
    private buttonManager:buttonManager
    private server: Server;

    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        });


        this.commandManager = new commandManager(this)
        this.eventManager = new eventManager(this)
        this.buttonManager=new buttonManager(this)

        this.server = new Server().start(3030)
    }

    public async reload(){        
        await this.commandManager.reload()
        await this.eventManager.reload()
        await this.buttonManager.reload()
        return this
    }    
}