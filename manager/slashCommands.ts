import { Client } from "discord.js";
import { baseManager, slashCommandHandler } from "./base";

export class slashCommandManager extends baseManager<slashCommandHandler>{
    constructor(client: Client) {
        super("slashCommands", client)
    }

    load(): void {
        this.client.on("interactionCreate", (interaction) => {
            /*
            if (!interaction.isCommand()) {
                return
            }
            const args = interaction.options.map(a => a.value)
            this.find(a => a.aliases.includes(interaction.commandName) || a.name == interaction.commandName)
                ?.exec(interaction, args)
                */
        })
    }
}