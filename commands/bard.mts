import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, Collection, EmbedBuilder, TextChannel } from "discord.js"
import { commandHandler } from "../manager/base.js"
import { startBard } from "../lib/bardHandler.mjs";




export const handler: commandHandler = {
    name: "bardchat",
    description:
        `
    Bardのチャットを開始します。
    resetでリセットできます。
    stopで応答を停止できます。
    #をつけるとコメントとみなされます。
    `,
    aliases: ["bard"],
    authority: "everyone",
    exec(bot, message, args) {
        if (message.channel.type !== ChannelType.GuildText) {
            return;
        }
        startBard(message.channel.id, message.guildId, bot.client)
        message.reply("Bardのチャットを開始しました。")
    },
}