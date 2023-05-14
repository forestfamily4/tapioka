import { commandHandler } from '../manager/base.js';
export const handler: commandHandler = {
    name: "reload",
    description: "reload",
    aliases: ["r"],
    authority: "admin",
    async exec(bot,message, args) {
        await bot.reload()
        message.reply("reloaded")
    }
}