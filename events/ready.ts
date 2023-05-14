import { Client } from "discord.js"
import { eventHandler } from "../manager/base"

export const handler: eventHandler<"ready"> = {
    name: "ready",
    exec: (bot,client) => {
        console.log(`ready as ${client.user?.tag}`)
    }
}