import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, EmbedBuilder, TextChannel } from "discord.js"
import { BingChat } from "./bing"
import { config } from "./config"

const BingApi: BingChat = new BingChat({ cookie: config.bing_token, debug: true })
type BingProps = {
    pending: boolean,
    channel: TextChannel,
    conversationId: string
}

export const BingChannelCollection = new Map<string, BingProps>()

export async function startBing(channelId: string, guildId: string, client: Client) {
    const a = await client.channels.fetch(channelId)
    if (a.type !== ChannelType.GuildText) {
        return;
    }
    if (!a) {
        return
    }
    const c=await BingApi.createConversation()
    BingChannelCollection.set(guildId, {
        pending: false,
        channel: a,
        conversationId: c.conversationId
    })
}

export async function askBing(text: string, guildId: string, client: Client) {
    const pending = () => { return BingChannelCollection.get(guildId)?.pending }
    const channel = () => { return BingChannelCollection.get(guildId)?.channel }
    const conversationId = () => { return BingChannelCollection.get(guildId)?.conversationId }
    const init = async () => {
        BingChannelCollection.set(guildId, {
            pending: false,
            channel: channel(),
            conversationId: (await BingApi.createConversation()).conversationId
        })
    }

    if (text.startsWith("#")) {
        return;
    }

    if (text.toLowerCase() == "reset") {
        init()
        return;
    }
    if (text.toLowerCase() == "stop") {
        channel().send("Bingの会話を停止しました。")
        BingChannelCollection.delete(guildId)
        return;
    }
    if (pending()) {
        return
    }

    BingChannelCollection.set(guildId, {
        pending: true,
        channel: channel(),
        conversationId: conversationId()
    })

    channel().sendTyping()

    let Res = await BingApi.sendMessage(text, { conversationId: conversationId() })
    if (Res.text?.includes('“New topic”') || ((Res.text ?? "") == text)) {
        init()
        return channel().send("Bingの会話が終了しました。<:kyouhu:1075997185923108874>");
    }

    const timeout = 40000;
    const startTime = Date.now();

    while (Res.text == "" || Res.text == undefined) {
        Res = await BingApi.sendMessage(text, { conversationId: conversationId() });

        if (Date.now() - startTime > timeout) {
            BingChannelCollection.set(guildId, {
                pending: false,
                channel: channel(),
                conversationId: conversationId()
            })
            return channel().send("タイムアウトしました。<:kyouhu:1075997185923108874>");
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second before trying again
    }

    const content = `${(Res.text == "" || Res.text == undefined) ? "もう一回送信してください<:kyouhu:1075997185923108874>" : Res.text}`

    const mainMes = new EmbedBuilder().setDescription(content).setTitle("Bing")
    const suggestions: Array<any> | undefined = (Res.detail as any)?.suggestedResponses
    const row = new ActionRowBuilder<ButtonBuilder>();

    if (suggestions) {
        for (let i = 0; i < suggestions.length; i++) {
            const suggestion = suggestions[i]
            const text = suggestion.text
            const button = new ButtonBuilder()
                .setCustomId(`askBing,${i}`)
                .setLabel(text.length > 79 ? text.slice(0, 79) + "..." : text)
                .setStyle(ButtonStyle.Primary);
            row.addComponents(button);
        }
    }
    if (row.components.length > 0) {
        await channel().send({
            embeds: [mainMes], components: [row]
        })
    }
    else {
        await channel().send({
            embeds: [mainMes]
        })
    }
    Res.detail?.sourceAttributions?.forEach((a: any) => {
        const ee = new EmbedBuilder()
        ee.setTitle(a.providerDisplayName)
        ee.setDescription(a.seeMoreUrl)
        if (a.imageLink) {
            ee.setThumbnail(a.imageLink)
        }
        channel().send(
            { "embeds": [ee] }
        )
    })

    BingChannelCollection.set(guildId, {
        pending: false,
        channel: channel(),
        conversationId: conversationId()
    })
}