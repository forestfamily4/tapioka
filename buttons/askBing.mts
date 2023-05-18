import { ButtonComponent } from "discord.js";
import { askBing } from "../commands/bing.mjs";
import { buttonHandler, eventHandler } from "../manager/base.js";

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
        a.edit("これについて回答します。")
    }
}