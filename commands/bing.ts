import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, Collection, EmbedBuilder, TextChannel } from "discord.js"
import { commandHandler } from "../manager/base"
import { startBing } from "../lib/bingHandler";




export const handler: commandHandler = {
    name: "bingchat",
    description:
        `
    Bingのチャットを開始します。
    resetでリセットできます。
    stopで応答を停止できます。
    #をつけるとコメントとみなされます。
    `,
    aliases: ["bing"],
    authority: "everyone",
    exec(bot, message, args) {
        if (message.channel.type !== ChannelType.GuildText) {
            return;
        }
        startBing(message.channel.id, message.guildId, bot.client)
        message.reply("Bingのチャットを開始しました。")
    },
}