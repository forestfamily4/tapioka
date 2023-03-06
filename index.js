const { AttachmentBuilder, GatewayIntentBits, Client } = require("discord.js");
require("dotenv").config()
const client = new Client({
  intents: Object.values(GatewayIntentBits).filter(Number.isInteger),
});
const express = require("express");
const app = express()
app.use(express.json()); 
app.listen(8080)
app.get("/", (req, res) => {
  res.send('botisok')
})
app.post("/cat",(req,res)=>{
  if(req.body.secret==process.env.SECRET){    client.channels.cache.get("959812406140346408").send(req.body.content)
    res.send("ok")
  }
  else{
    res.send("no")
  }
})

client.once("ready", async () => {
  console.log("botisready" + client.user.tag)
  await initBing()
})

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (!["898576967136337970", "890218656791924776", "1081043819916709898", "852470347907334204"].includes(message.guild.id)) return;

  if (["742347739018297346", "890866636712722494"].includes(message.author.id)) {
    if (Math.random() < 0.5) {
      message.channel.send("宿題をやりなさい:rage:")
    }
  }
  try {
    bing(message)
  }
  catch (e) {
    typingFinished = true;
    console.log(e)
    message.reply("Error!!\n```" + e + "```")
  }
  if (message.mentions.users.has(client.user.id)) {
    message.reply(`Pong!${client.ws.ping}ms.`)
  }
  else {
    if (message.content.includes("?eval")) {
      const s = message.content.slice(6)
      let result = "";
      try {
        result = require("util").inspect(eval(s))
      } catch (error) {
        result = require("util").inspect(error)
      }
      reply(message, result.length < 1980 ? "```js\n" + result + "```" : result)
    }
  }
})
client.login(process.env.DISCORD_TOKEN)

client.on("presenceUpdate", function (oldPresence, newPresence) {
  try {
    const channel = client.channels.cache.get("959996436970356746")

    if (oldPresence.status == newPresence.status) { return; }
    if (oldPresence.guild.id !== "852470347907334204") { return; }
    const user = newPresence.guild.members.cache.get(newPresence.userId)
    const m = `${getpresenceicon(oldPresence.status)} -> ${getpresenceicon(newPresence.status)}`;
    const a = {
      author: {
        name: `${user.user.username}      (${user.nickname})`,
        icon_url: user.user.avatarURL()
      },
      description: m
    }
    channel.send({ embeds: [a] })
  } catch (e) { }
})

function getpresenceicon(m) {
  if (m == "idle") {
    return "<:idle:1012350542149861416>"
  }
  else if (m == "dnd") {
    return "<:dnd:1012351204694695987>"
  }
  else if (m == "offline") {
    return "<:offline:1012351605993132102>"
  }
  else if (m == "online") {
    return "<:online:1012353842484101130>"
  }
}

async function bing(message) {
  if (message.channel.id !== "1081869328250572800") return;
  if (message.content.startsWith("#")) return;
  if (message.content.toLowerCase() == "reset") {
    await initBing()
    return message.reply("Bingの会話をリセットしました。");
  }
  const prompt = message.content
  let typingFinished = false
  message.channel.sendTyping()
  if (BingRes) {
    BingRes = await BingApi.sendMessage(prompt, BingRes)
    console.log(BingRes)
    typingFinished = true;
    if (BingRes.text.includes('“New topic”')) {
      await initBing()
      return message.reply("Bingの会話が終了しました。");
    }
    reply(message, BingRes.text)
  }
  else {
    BingRes = await BingApi.sendMessage(prompt)
    typingFinished = true;
    if (BingRes.text.includes('“New topic”')) {
      await initBing()
      return message.reply("Bingの会話が終了しました。");
    }
    reply(message, BingRes.text)
  }
}

async function initBing() {
  const BingChat = (await import("bing-chat")).BingChat
  BingApi = new BingChat({ cookie: process.env.BING_COOKIE })
  BingRes = undefined
}
let BingApi
let BingRes

async function reply(message, content) {
  if (content.length < 2000) {
    message.reply({
      content: content == "" ? "Empty" : content,
      allowedMentions: {
        repliedUser: false
      }
    })
  }
  else {
    message.reply({
      files: [
        new AttachmentBuilder(Buffer.from(content), {
          name: "rage.js",
        }),
      ],
      allowedMentions: {
        repliedUser: false
      }
    })
  }
}