import { exec, execSync } from 'child_process';
import { commandHandler } from '../manager/base.js';
export const handler: commandHandler = {
    name: "reload",
    description: "reload",
    aliases: ["r"],
    authority: "admin",
    async exec(bot,message, args) {
        execSync("git pull")
        console.log("pull")
        execSync("npx tsc")
        console.log("tsc")
        process.kill(process.pid)
    }
}