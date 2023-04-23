import { Client } from "discord.js"
import { eventHandler } from "../manager/base"

export const handler: eventHandler<"ready"> = {
    name: "ready",
    exec: (client:Client) => {
        console.log(`ready as ${client.user?.tag}`)
    }
}