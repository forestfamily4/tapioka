import { Client, ClientEvents } from "discord.js"
import { baseManager, handler } from "./base"

export class eventManager extends baseManager<handler>{
    constructor(client: Client) {
        super("events", client)
    }

    load(): void {
        this.forEach(handler => {            
            this.client.on(handler.name, (...args) => {
                handler.exec(...args,this.client)
            })
        })
    }
}