import { Client, ClientEvents, EmbedBuilder, Message } from "discord.js";
import { eventHandler } from "../manager/base.js";
import { config } from "../lib/config.js";
import { BingChat, ChatMessage } from "bing-chat";





export const handler: eventHandler<"messageCreate"> = {
    name: "messageCreate",

    exec: async(bot, message) => {
        if (["742347739018297346", "890866636712722494"].includes(message.author.id)) {
            if (Math.random() < 0.5) {
                message.channel.send("宿題をやりなさい:rage:")
            }
        }
        await initBing()
        if(!message.author.bot){
            bing(message)
        }
        
    }
}

async function bing(message:Message,text?:string) {
    if (message.channel.id !== "1081869328250572800") return;
    if (message.content.startsWith("#")) return;
    if (message.content.toLowerCase() == "reset") {
      Pending = false
      await initBing()
      return message.reply("Bingの会話をリセットしました。");
    }
    if (Pending&&!message.author.bot) {
      return message.reply("Bingの会話を処理中です。しばらくお待ちください。")
    }
    Pending = true;
    message.channel.sendTyping()    
    const Res = await BingApi.sendMessage(text??message.content, {conversationId:BingResId})
    console.log(Res)
    if (Res.text?.includes('“New topic”') || ((Res.text ?? "") == message.content)) {
      await initBing()
      Pending = false;
      return message.reply("Bingの会話が終了しました。<:kyouhu:1075997185923108874>");
    }
    const content = `${(Res.text == "" || Res.text == undefined) ? "これは話せない内容のようです<:kyouhu:1075997185923108874>" : Res.text}`
  
  
  
    message.channel.send({ embeds: [new EmbedBuilder().setDescription(content).setTitle("Bing")] })
    Res.detail?.sourceAttributions?.forEach((a:any) => {
      const ee = new EmbedBuilder()
      ee.setTitle(a.providerDisplayName)
      ee.setDescription(a.seeMoreUrl)
      if (a.imageLink) {
        ee.setThumbnail(a.imageLink)
      }
      message.channel.send(
        { "embeds": [ee] }
      )
    })
    Pending = false;
  
  
  
  }
  
  async function initBing() {
    if(!BingApi){
        BingApi = new BingChat({ cookie: config.bing_token })
    }
    BingResId=(await BingApi.createConversation()).conversationId
  }
  let BingApi:BingChat
  let BingResId=""
  let Pending=false