import { commandHandler } from "../manager/base"

export const handler: commandHandler = {
    name: "ping",
    description: "ping",
    aliases: ["pong"],
    exec(message, args) {
        message.reply("pong!botbotより優秀dayo")
    },
}