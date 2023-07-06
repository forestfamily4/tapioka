import { Client } from "discord.js"
import { eventHandler } from "../manager/base.js"
import { BardChannelCollection, startBard } from "../lib/bardHandler.mjs"
import { startBing } from "../lib/bingHandler.js"

export const handler: eventHandler<"ready"> = {
    name: "ready",
    exec: async (bot, client) => {
        console.log(`ready as ${client.user?.tag}`)
        await startBard("1096264729376342016", "852470347907334204", client)
        //await startBing("1081869328250572800", "852470347907334204", client)        
    }
}