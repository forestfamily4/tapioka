import dotenv from "dotenv"
dotenv.config()

type config={
    token:string,
    prefix:string,    
    bing_token:string,
    isDev:boolean
}

export const config:config={
    token:process.env['TOKEN']??'',
    prefix:"!",
    bing_token:process.env['BING-TOKEN']??'',
    isDev:process.env['NODE_ENV']!=='production'
}