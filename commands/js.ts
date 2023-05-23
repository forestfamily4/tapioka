import { AttachmentBuilder } from "discord.js";
import { commandHandler } from "manager/base";
import { inspect } from "util";

export const handler: commandHandler = {
    name: "js",
    description: "jsを実行します。",
    aliases: ["javascript"],
    authority: "admin",
    async exec(bot, message, args) {
        try {
            const a = await eval(message.content.slice(4))
            const result = inspect(a)
            if (result.length > 2000) {
                await message.channel.send({
                    files: [
                        new AttachmentBuilder(Buffer.from(result), {
                            name: `out.js`,
                        }),
                    ],
                });
                return;
            }
            await message.channel.send(
                `\`\`\`js\n${result}\n\`\`\``
            );
        } catch (error: unknown) {
            message.reply(
                (error as Error).stack ??
                (error as Error).message ??
                String(error) ??
                "エラーが発生しました。"
            );
        }
    }
}