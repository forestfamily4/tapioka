
import { Bard } from "googlebard";
import { config } from "./config.js";
import { ChannelType, Client, TextChannel } from "discord.js";
import { sendLot } from "./sendLot.js";


const BardApi = new Bard(config.bard_token)

type BardProps = {
    pending: boolean,
    channel: TextChannel,
    conversationId: string
}

export const BardChannelCollection = new Map<string, BardProps>()


export async function startBard(channelId: string, guildId: string, client: Client) {
    const a = await client.channels.fetch(channelId)
    if (a.type !== ChannelType.GuildText) {
        return;
    }
    if (!a) {
        return
    }
    BardApi.addConversation(a.id)
    BardChannelCollection.set(guildId, {
        pending: false,
        channel: a,
        conversationId: a.id
    })
}

export async function askBard(text: string, guildId: string, client: Client) {
    const pending = () => { return BardChannelCollection.get(guildId)?.pending }
    const channel = () => { return BardChannelCollection.get(guildId)?.channel }
    const conversationId = () => { return BardChannelCollection.get(guildId)?.conversationId }
    if (text.startsWith("#")) {
        return;
    }

    if (text.toLowerCase() == "reset") {
        initBard(guildId)
        return;
    }
    if (text.toLowerCase() == "stop") {
        channel().send("Bardの会話を停止しました。")
        BardChannelCollection.delete(guildId)
        return;
    }
    if (pending()) {
        return
    }

    BardChannelCollection.set(guildId, {
        pending: true,
        channel: channel(),
        conversationId: conversationId()
    })

    channel().sendTyping()

    let Res = await BardApi.ask(text, conversationId())
    if (((Res ?? "") == text)) {
        initBard(guildId)
        return channel().send("Bardの会話が終了しました。<:kyouhu:1075997185923108874>");
    }

    const timeout = 20000;
    const startTime = Date.now();

    while (Res == "" || Res == undefined) {
        Res = await BardApi.ask(text, conversationId()) as string;
        console.log(Res)
        channel().sendTyping()
        if (Date.now() - startTime > timeout) {            
            BardChannelCollection.set(guildId, {
                pending: false,
                channel: channel(),
                conversationId: conversationId()
            })
            return channel().send("タイムアウトしました。<:kyouhu:1075997185923108874>");
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

    const content = `${(Res == "" || Res == undefined) ? "もう一回送信してください<:kyouhu:1075997185923108874>" : Res}`
    await sendLot(channel(), content)

    BardChannelCollection.set(guildId, {
        pending: false,
        channel: channel(),
        conversationId: conversationId()
    })
}

export const initBard = (guildId: string) => {
    const channel = () => { return BardChannelCollection.get(guildId)?.channel }
    const conversationId = () => { return BardChannelCollection.get(guildId)?.conversationId }
    BardApi.resetConversation(conversationId())
    BardChannelCollection.set(guildId, {
        pending: false,
        channel: channel(),
        conversationId: conversationId()
    })
}