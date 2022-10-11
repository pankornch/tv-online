import React from "react"

import { IChannel } from "@/types"
import { Player } from "./Player"
import { compactNumber, getAvatarUrl } from "@/utils"

import { ReactComponent as UserSVG } from "@/assets/user.svg"
import AvatarGroup from "./AvatarGroup"

interface Props {
    channel: IChannel
    userWatching: string[]
}

function ChannelSection({ channel, userWatching }: Props) {
    const playerRef = React.useRef<null | HTMLVideoElement>(null)

    return (
        <div className="aspect-video w-full">
            <Player
                url={channel.url}
                playerRef={playerRef}
                userCount={userWatching.length}
            />

            <div className="mt-4 grid grid-cols-9 items-start">
                <div className="col-span-7">
                    <h4 className="truncate pr-6 font-medium text-white">
                        {channel.name}: {channel.title}
                    </h4>
                    <p className="mt-4 text-gray-400">{channel.description}</p>
                </div>

                <div className="col-span-2 flex flex-col items-end gap-y-3 text-white">
                    <div className="flex items-center gap-x-2">
                        <UserSVG className="h-4" />
                        <p>{compactNumber(channel.views)} views</p>
                    </div>

                    <AvatarGroup
                        urls={userWatching.map((e) => getAvatarUrl(e))}
                        max={2}
                    />

                    <p className="text-xs text-gray-400">
                        {compactNumber(userWatching.length)} USERS WATCHING
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChannelSection
