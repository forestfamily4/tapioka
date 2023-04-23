import { Client, ClientEvents, Collection, Message } from "discord.js"
import { readdir, statSync } from "fs"
import { config } from "../lib/config"
export interface handler {
    name: string
    exec: Function
}

export interface commandHandler extends handler {
    description: string
    aliases: string[]
    exec: (message: Message, args: string[], client: Client) => void | Promise<void>
}

export interface eventHandler<T extends keyof ClientEvents> extends handler {
    exec: ( client: Client,...args: ClientEvents[T]) => void | Promise<void>;
}

export interface slashCommandHandler extends handler {
    exec: (interaction: Message, args: string[]) => void | Promise<void>
}

export abstract class baseManager<T extends handler> extends Collection<string, T>{
    constructor(private path: string, readonly client: Client) {
        super()
        this.setPath()
        this.loadModule()
        this.load()
    }

    abstract load(): void

    private setPath() {
        this.path = `${config.isDev ? "dist" : "src"}/${this.path}`
    }

    private loadModule() {
        readdir(this.path, (_, files) => {
            files.forEach(file => {
                if (!statSync(`${this.path}/${file}`).isFile()) { return }
                const handler: T = require(`${process.cwd()}/${this.path}/${file}`).handler
                console.log(`Loaded ${this.constructor.name} ${handler.name}`)
                this.set(handler.name, handler)
            })
        })
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