import { Client } from "discord.js";
import { baseManager, commandHandler } from "./base";
import { config } from "../lib/config";


export class commandManager extends baseManager<commandHandler>{
    constructor(client: Client) {
        super("commands", client)
    }

    load(): void {
        this.client.on("messageCreate", (message) => {
            const args = message.content.split(/ |　/)
            let command = args.shift() ?? ""
            
            if (!command.startsWith(config.prefix)) {
                return
            }
            command=command.slice(config.prefix.length)
            this.find(a => a.aliases.includes(command) || a.name == command)
                ?.exec(message, args, this.client)
        })
    }
}
