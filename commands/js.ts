import { commandHandler } from "manager/base";
import { inspect } from "util";

export const handler: commandHandler = {
    name: "js",
    description: "jsを実行します。",
    aliases: ["javascript"],
    authority: "admin",
    async exec(bot, message, args) {
        try {
            const a=await eval(message.content.slice(4))
            message.reply(`
            \`\`\`js
            ${inspect(a)}
            \`\`\`
            `)
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