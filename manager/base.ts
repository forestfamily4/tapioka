import { Client, ClientEvents, Collection, Message } from "discord.js"
import { readdirSync, statSync } from "fs"
import { config } from "../lib/config"
import { Bot } from "../bot"
export interface handler {
    name: string
    exec: Function

}
export type Authority = "admin" | "everyone"

export interface commandHandler extends handler {
    description: string
    aliases: string[]
    authority: Authority
    exec: (bot: Bot, message: Message, args: string[],) => void | Promise<void>
}

export interface eventHandler<T extends keyof ClientEvents> extends handler {
    name: T,
    exec: (bot: Bot, ...args: ClientEvents[T]) => void | Promise<void>;
}

export interface slashCommandHandler extends handler {
    exec: (interaction: Message, args: string[]) => void | Promise<void>
}

export abstract class baseManager<T extends handler> extends Collection<string, T>{
    constructor(private path: string, readonly client: Client, readonly bot: Bot) {
        super()
        this.setPath()
        this.reload()
    }

    abstract load(): void

    private setPath() {
        this.path = `${config.isDev ? "dist" : "src"}/${this.path}`
    }

    private loadModule() {
        readdirSync(this.path).forEach(file => {
            if (!statSync(`${this.path}/${file}`).isFile()) { return }
            const handler: T = require(`${process.cwd()}/${this.path}/${file}`).handler
            console.log(`Loaded ${this.constructor.name} ${handler.name}`)
            this.set(handler.name, handler)
        })
    }

    public async reload() {
        this.loadModule()
        this.load()
    }
}


export interface slashCommand {
    name: string
    description: string
    options?: {
        name: string
        description: string
        type: number
        required?: boolean
    }[]
}

export interface slashCommandOption {
    name: string
    description: string
    type: number
    required?: boolean
}

export interface slashCommandOptionType {
    SUB_COMMAND: number
    SUB_COMMAND_GROUP: number
    STRING: number
    INTEGER: number
    BOOLEAN: number
    USER: number
    CHANNEL: number
    ROLE: number
}