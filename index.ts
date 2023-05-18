import { config } from "./lib/config.js";
import { Bot } from "./bot.js";

export const bot=new Bot()

const main=async()=>{
    await bot.reload()
    bot.client.login(config.token)
}

main()