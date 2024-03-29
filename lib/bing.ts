import crypto from 'node:crypto'

import WebSocket from 'ws'
import post from "axios"

export type Author = 'user' | 'bot'

export type SendMessageOptions = {
    conversationId?: string
    clientId?: string
    conversationSignature?: string
    invocationId?: string
    messageType?: string
    variant?: string
    locale?: string
    market?: string
    region?: string
    location?: {
        lat: number | string
        lng: number | string
        re?: string
    }

    onProgress?: (partialResponse: ChatMessage) => void
}

export interface ChatMessage {
    id: string
    text: string
    author: Author

    conversationId: string
    clientId: string
    conversationSignature: string
    conversationExpiryTime?: string
    invocationId?: string
    messageType?: string
    variant?: string

    detail?: ChatMessageFull | ChatMessagePartial
}

export interface ConversationResult {
    conversationId: string
    clientId: string
    conversationSignature: string
    result: APIResult
}

export interface APIResult {
    value: string
    message: null
}

export interface ChatUpdate {
    type: 1
    target: string
    arguments: ChatUpdateArgument[]
}

export interface ChatUpdateArgument {
    messages: ChatMessagePartial[]
    requestId: string
    result: null
}

export interface ChatMessagePartial {
    text: string
    author: Author
    createdAt: string
    timestamp: string
    messageId: string
    offense: string
    adaptiveCards: AdaptiveCard[]
    sourceAttributions: any[]
    feedback: ChatMessageFeedback
    contentOrigin: string
    privacy?: null
    messageType?: string
}

export interface AdaptiveCard {
    type: string
    version: string
    body: AdaptiveCardBody[]
}

export interface AdaptiveCardBody {
    type: string
    text: string
    wrap: boolean
}

export interface ChatMessageFeedback {
    tag: null
    updatedOn: null
    type: string
}

export interface ChatUpdateCompleteResponse {
    type: 2
    invocationId: string
    item: ChatResponseItem
}

export interface ChatResponseItem {
    messages: ChatMessageFull[]
    firstNewMessageIndex: number
    suggestedResponses: null
    conversationId: string
    requestId: string
    conversationExpiryTime: string
    telemetry: Telemetry
    result: ChatRequestResult
}

export interface ChatMessageFull {
    text: string
    author: Author
    from?: ChatMessageFrom
    createdAt: string
    timestamp: string
    locale?: string
    market?: string
    region?: string
    location?: string
    locationHints?: LocationHint[]
    messageId: string
    requestId: string
    offense: string
    feedback: ChatMessageFeedback
    contentOrigin: string
    privacy?: null
    inputMethod?: string
    adaptiveCards?: AdaptiveCard[]
    sourceAttributions?: any[]
    suggestedResponses?: SuggestedResponse[]
    messageType?: string
}

export interface ChatMessageFrom {
    id: string
    name: null
}

export interface LocationHint {
    country: string
    countryConfidence: number
    state: string
    city: string
    cityConfidence: number
    zipCode: string
    timeZoneOffset: number
    dma: number
    sourceType: number
    center: Coords
    regionType: number
}

export interface Coords {
    latitude: number
    longitude: number
    height: null
}

export interface SuggestedResponse {
    text: string
    messageId: string
    messageType: string
    contentOrigin: string
    author?: Author
    createdAt?: string
    timestamp?: string
    offense?: string
    feedback?: ChatMessageFeedback
    privacy?: null
}

export interface ChatRequestResult {
    value: string
    serviceVersion: string
}

export interface Telemetry {
    metrics?: null
    startTime: string
}

export interface ChatRequest {
    arguments: ChatRequestArgument[]
    invocationId: string
    target: string
    type: number
}

export interface ChatRequestArgument {
    source: string
    optionsSets: string[]
    allowedMessageTypes: string[]
    sliceIds: any[]
    traceId: string
    isStartOfSession: boolean
    message: ChatRequestMessage
    conversationSignature: string
    participant: Participant
    conversationId: string
    previousMessages: PreviousMessage[]
}

export interface ChatRequestMessage {
    locale: string
    market: string
    region?: string
    location?: string
    locationHints?: LocationHintChatRequestMessage[]
    timestamp: string
    author: Author
    inputMethod: string
    text: string
    messageType: string
}

export interface LocationHintChatRequestMessage {
    country: string
    state: string
    city: string
    zipcode: string
    timezoneoffset: number
    dma: number
    countryConfidence: number
    cityConfidence: number
    Center: Center
    RegionType: number
    SourceType: number
}

export interface Center {
    Latitude: number
    Longitude: number
}

export interface Participant {
    id: string
}

export interface PreviousMessage {
    text: string
    author: Author
    adaptiveCards: any[]
    suggestedResponses: SuggestedResponse[]
    messageId: string
    messageType: string
}

const terminalChar = ''

export class BingChat {
    protected _cookie: string
    protected _debug: boolean

    constructor(opts: {
        cookie: string

        /** @defaultValue `false` **/
        debug?: boolean
    }) {
        const { cookie, debug = false } = opts

        this._cookie = cookie
        this._debug = !!debug

        if (!this._cookie) {
            throw new Error('Bing cookie is required')
        }
    }

    /**
     * Sends a message to Bing Chat, waits for the response to resolve, and returns
     * the response.
     *
     * If you want to receive a stream of partial responses, use `opts.onProgress`.
     *
     * @param message - The prompt message to send
     * @param opts.conversationId - Optional ID of a conversation to continue (defaults to a random UUID)
     * @param opts.onProgress - Optional callback which will be invoked every time the partial response is updated
     *
     * @returns The response from Bing Chat
     */
    async sendMessage(
        text: string,
        opts: SendMessageOptions = {}
    ): Promise<ChatMessage> {
        const {
            invocationId = '1',
            onProgress,
            locale = 'en-US',
            market = 'en-US',
            region = 'US',
            location,
            messageType = 'Chat',
            variant = 'Balanced'
        } = opts

        let { conversationId, clientId, conversationSignature } = opts
        const isStartOfSession = !(
            conversationId &&
            clientId &&
            conversationSignature
        )

        if (isStartOfSession) {
            const conversation = await this.createConversation()
            conversationId = conversation.conversationId
            clientId = conversation.clientId
            conversationSignature = conversation.conversationSignature
        }

        const result: ChatMessage = {
            author: 'bot',
            id: crypto.randomUUID(),
            conversationId,
            clientId,
            conversationSignature,
            invocationId: `${parseInt(invocationId, 10) + 1}`,
            text: ''
        }

        const responseP = new Promise<ChatMessage>(
            async (resolve, reject) => {
                const chatWebsocketUrl = 'wss://sydney.bing.com/sydney/ChatHub'
                const ws = new WebSocket(chatWebsocketUrl, {
                    perMessageDeflate: false,
                    headers: {
                        'accept-language': 'en-US,en;q=0.9',
                        'cache-control': 'no-cache',
                        pragma: 'no-cache'
                    }
                })

                let isFulfilled = false

                function cleanup() {
                    ws.close()
                    ws.removeAllListeners()
                }

                ws.on('error', (error) => {
                    console.warn('WebSocket error:', error)
                    cleanup()
                    if (!isFulfilled) {
                        isFulfilled = true
                        reject(new Error(`WebSocket error: ${error.toString()}`))
                    }
                })
                ws.on('close', () => {
                    // TODO
                })

                ws.on('open', () => {
                    ws.send(`{"protocol":"json","version":1}${terminalChar}`)
                })
                let stage = 0

                ws.on('message', (data) => {
                    const objects = data.toString().split(terminalChar)

                    const messages = objects
                        .map((object) => {
                            try {
                                return JSON.parse(object)
                            } catch (error) {
                                return object
                            }
                        })
                        .filter(Boolean)

                    if (!messages.length) {
                        return
                    }

                    if (stage === 0) {
                        ws.send(`{"type":6}${terminalChar}`)

                        const traceId = crypto.randomBytes(16).toString('hex')

                        // example location: 'lat:47.639557;long:-122.128159;re=1000m;'
                        const locationStr = location
                            ? `lat:${location.lat};long:${location.lng};re=${location.re || '1000m'
                            };`
                            : undefined

                        // Sets the correct options for the variant of the model
                        const optionsSets = [
                            'nlu_direct_response_filter',
                            'deepleo',
                            'enable_debug_commands',
                            'disable_emoji_spoken_text',
                            'responsible_ai_policy_235',
                            'enablemm'
                        ]
                        if (variant == 'Balanced') {
                            optionsSets.push('galileo')
                        } else {
                            optionsSets.push('clgalileo')
                            if (variant == 'Creative') {
                                optionsSets.push('h3imaginative')
                            } else if (variant == 'Precise') {
                                optionsSets.push('h3precise')
                            }
                        }
                        const params = {
                            arguments: [
                                {
                                    source: 'cib',
                                    optionsSets,
                                    allowedMessageTypes: [
                                        'Chat',
                                        'InternalSearchQuery',
                                        'InternalSearchResult',
                                        'InternalLoaderMessage',
                                        'RenderCardRequest',
                                        'AdsQuery',
                                        'SemanticSerp'
                                    ],
                                    sliceIds: [],
                                    traceId,
                                    isStartOfSession,
                                    message: {
                                        locale,
                                        market,
                                        region,
                                        location: locationStr,
                                        author: 'user',
                                        inputMethod: 'Keyboard',
                                        messageType,
                                        text
                                    },
                                    conversationSignature,
                                    participant: { id: clientId },
                                    conversationId
                                }
                            ],
                            invocationId,
                            target: 'chat',
                            type: 4
                        }

                        if (this._debug) {
                            console.log(chatWebsocketUrl, JSON.stringify(params, null, 2))
                        }

                        ws.send(`${JSON.stringify(params)}${terminalChar}`)

                        ++stage
                        return
                    }

                    for (const message of messages) {
                        // console.log(JSON.stringify(message, null, 2))

                        if (message.type === 1) {
                            const update = message as ChatUpdate
                            const msg = update.arguments[0].messages?.[0]

                            if (!msg) continue

                            // console.log('RESPONSE0', JSON.stringify(update, null, 2))

                            if (!msg.messageType) {
                                result.author = msg.author
                                result.text = msg.text
                                result.detail = msg

                                onProgress?.(result)
                            }
                        } else if (message.type === 2) {
                            const response = message as ChatUpdateCompleteResponse
                            if (this._debug) {
                                console.log('RESPONSE', JSON.stringify(response, null, 2))
                            }
                            const validMessages = response.item.messages?.filter(
                                (m) => !m.messageType
                            )
                            const lastMessage = validMessages?.[validMessages?.length - 1]

                            if (lastMessage) {
                                result.conversationId = response.item.conversationId
                                result.conversationExpiryTime =
                                    response.item.conversationExpiryTime

                                result.author = lastMessage.author
                                result.text = lastMessage.text
                                result.detail = lastMessage

                                if (!isFulfilled) {
                                    isFulfilled = true
                                    resolve(result)
                                }
                            }
                        } else if (message.type === 3) {
                            if (!isFulfilled) {
                                isFulfilled = true
                                resolve(result)
                            }

                            cleanup()
                            return
                        } else {
                            // TODO: handle other message types
                            // these may be for displaying "adaptive cards"
                            // console.warn('unexpected message type', message.type, message)
                        }
                    }
                })
            }
        )

        return responseP
    }

    async createConversation(): Promise<ConversationResult> {
        const requestId = crypto.randomUUID()

        const cookie = this._cookie.includes(';')
            ? this._cookie
            : `_U=${this._cookie}`

        
        const getRandomInt = (a: number, b: number) => {
            const min = Math.ceil(a);
            const max = Math.floor(b);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const ip=`13.${getRandomInt(104,107)}.${getRandomInt(0,255)}.${getRandomInt(0,255)}`

        const postData = await post('https://www.bing.com/turing/conversation/create', {
            headers: {
                accept: 'application/json',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/json',
                'sec-ch-ua':
                    '"Not_A Brand";v="99", "Microsoft Edge";v="109", "Chromium";v="109"',
                'sec-ch-ua-arch': '"x86"',
                'sec-ch-ua-bitness': '"64"',
                'sec-ch-ua-full-version': '"109.0.1518.78"',
                'sec-ch-ua-full-version-list':
                    '"Not_A Brand";v="99.0.0.0", "Microsoft Edge";v="109.0.1518.78", "Chromium";v="109.0.5414.120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': '',
                'sec-ch-ua-platform': '"macOS"',
                'sec-ch-ua-platform-version': '"12.6.0"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-edge-shopping-flag': '1',
                "x-forwarded-for": ip,
                'x-ms-client-request-id': requestId,
                'x-ms-useragent':
                    'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/MacIntel',
                cookie
            },
            // referrer: 'https://www.bing.com/search',
            // referrerPolicy: 'origin-when-cross-origin',
            // body: null,
            method: 'GET',
            // mode: 'cors',
            //  credentials: 'include'
        })
        if (postData.data) {
            return postData.data
        } else {
            throw new Error("Couldn't create conversation")
        }
    }
}