import React from "react"
import { IChannel, IHotChannel } from "@/types"

import { ReactComponent as FireSVG } from "@/assets/fire.svg"

interface Props {
    channel: IChannel
    action?: React.ReactNode
    onClick?: (channel: IChannel) => void
    hotChannel?: IHotChannel
}

function VidoCard(props: Props) {
    function handleClick() {
        props.onClick?.call(null, props.channel)
    }

    return (
        <div className="relative cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
            {props.action && (
                <div className="absolute top-0 right-0 flex h-16 w-full items-center justify-end gap-x-3 bg-gradient-to-b from-black/50 to-transparent px-4">
                    {props.action}
                </div>
            )}
            {props.hotChannel && (
                <div className="absolute top-0 left-0 flex h-16 w-full items-center gap-x-1 bg-gradient-to-b from-black/50 to-transparent px-4">
                    <FireSVG className="h-6 text-red-500" />
                    <p className="text-sm font-medium text-white">
                        {props.hotChannel.users.length} users
                    </p>
                </div>
            )}
            <div onClick={handleClick}>
                <img
                    src={props.channel.image}
                    className="aspect-video w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent px-8 py-4 text-white underline-offset-2 shadow-xl transition-all hover:from-black/75 hover:font-medium hover:underline">
                    <p>{props.channel.name}</p>
                    <h6 className="w-full font-medium line-clamp-2">
                        {props.channel.title}
                    </h6>
                </div>
            </div>
        </div>
    )
}

export default VidoCard
