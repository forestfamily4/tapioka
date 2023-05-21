import { ButtonComponent } from "discord.js";
import { buttonHandler, eventHandler } from "../manager/base.js";
import { askBing } from "../lib/bingHandler";

export const handler: buttonHandler = {
    name: "askBing",
    async exec(bot, args, interaction) {
        if (args.length < 1) {
            return
        }
        const text = (interaction.message.components[0].components[args[0]] as ButtonComponent)?.label
        if (!text) { return; }
        const a = await interaction.deferReply();
        await askBing(text, interaction.guildId, bot.client);
        a.edit(text)
    }
}