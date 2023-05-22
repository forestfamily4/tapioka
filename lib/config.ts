import dotenv from "dotenv"
dotenv.config()

type config = {
    token: string,
    prefix: string,
    bing_token: string,
    isDev: boolean,
    owner: string[],
    bard_token:string
}

export const config: config = {
    token: process.env['TOKEN'] ?? '',
    prefix: "!",
    bing_token: process.env['BING_TOKEN'] ?? '',
    isDev: true,
    owner: ["894380953718390785","835036688849043468"],
    bard_token:process.env['BARD_TOKEN'] ?? ''
}