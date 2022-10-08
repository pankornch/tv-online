export interface IChannel {
    id: string
    name: string
    image: string
    url: string
    title: string
    description: string
    views: number
}

export interface IChannelLog {
    id: string
    channelID: string
    uid?: string
    eventName: string
    createdAt: string
    updatedAt: string
    channel: IChannel
}

export interface IChannelChat {
    id: string
    uid: string
    text: string
    channelID: string
    createdAt: string
}
