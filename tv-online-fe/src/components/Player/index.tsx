import React from "react"
import HlsPlayerMemo from "./HlsPlayerMemo"
import LiveCover from "./LiveCover"
import PlayButton from "./PlayButton"

interface Props {
    playerRef: React.RefObject<HTMLVideoElement>
    url: string
    userCount: number
}

export function Player(props: Props) {
    return (
        <div className="relative isolate h-full w-full">
            <LiveCover userCount={props.userCount} />
            <HlsPlayerMemo url={props.url} playerRef={props.playerRef} />
            <PlayButton playerRef={props.playerRef} />
        </div>
    )
}
