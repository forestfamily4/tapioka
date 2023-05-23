import { BardChannelCollection, askBard } from "../lib/bardHandler.mjs";
import { BingChannelCollection, askBing } from "../lib/bingHandler.js";
import { eventHandler } from "../manager/base.js";

export const handler: eventHandler<"messageCreate"> = {
  name: "messageCreate",
  exec: async (bot, message) => {
    if (["742347739018297346", "890866636712722494"].includes(message.author.id)) {
      if (Math.random() < 0.2) {
        message.channel.send("宿題をやりなさい:rage:")
      }
    }

    if (!message.author.bot) {
      if (BingChannelCollection.has(message.guildId)&&(message.channelId==BingChannelCollection.get(message.guildId).channel.id)) {
        const data = BingChannelCollection.get(message.guildId)
        if (data.pending) {
          message.reply("Bingのチャットは応答中です。")
        }
        else {
          askBing(message.content, message.guildId, bot.client)
        }
        return;
      }

      if (BardChannelCollection.has(message.guildId)) {
        const data = BardChannelCollection.get(message.guildId)
        
        if(message.channelId!==data.channel.id){
          return
        }
        if (data.pending) {
          message.reply("Bardのチャットは応答中です。")
        }
        else {
          askBard(message.content, message.guildId, bot.client)
        }
        return;
      }
    }

  }
}