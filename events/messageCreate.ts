import { Client, ClientEvents, Message } from "discord.js";
import { eventHandler } from "../manager/base";

export const handler: eventHandler<"messageCreate"> = {
    name: "messageCreate",

    exec: (client: Client, message: Message) => {
        
    }
}

