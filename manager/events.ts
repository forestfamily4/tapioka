import { Client, ClientEvents } from "discord.js"
import { baseManager, eventHandler, handler } from "./base"
import { Bot } from "../bot"

export class eventManager extends baseManager<handler>{
    constructor(bot: Bot) {
        super("events", bot.client, bot)
    }

    load(): void {
        this.forEach(handler => {
            this.client.on(handler.name, (...args) => {
                handler.exec(this.bot, ...args)
            })
        })
    }
}