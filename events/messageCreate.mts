import { eventHandler } from "../manager/base.js";
import { BingChannelCollection, askBing } from "../commands/bing.mjs";

export const handler: eventHandler<"messageCreate"> = {
  name: "messageCreate",
  exec: async (bot, message) => {
    if (["742347739018297346", "890866636712722494"].includes(message.author.id)) {
      if (Math.random() < 0.5) {
        message.channel.send("宿題をやりなさい:rage:")
      }
    }

    //bing
    if (!message.author.bot) {
      if (BingChannelCollection.has(message.guildId)) {
        const data = BingChannelCollection.get(message.guildId)
        if(message.channelId!==data.channel.id){
          return
        }
        if (data.pending) {
          message.reply("Bingのチャットは応答中です。")
        }
        else {
          askBing(message.content, message.guildId, bot.client)
        }
        return;
      }
    }

  }
}