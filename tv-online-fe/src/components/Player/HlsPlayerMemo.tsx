import React from "react"
import ReactHlsPlayer from "react-hls-player"

const HlsPlayerMemo = React.memo<{
    url: string
    playerRef: React.MutableRefObject<HTMLVideoElement | null>
}>(function hlsPlayer(props) {
    return (
        <ReactHlsPlayer
            src={props.url}
            playerRef={props.playerRef}
            muted
            autoPlay
            className="aspect-video h-full"
            preload="auto"
            hlsConfig={{
                autoStartLoad: true,
                maxBufferSize: 1 * 1000 * 1000,
            }}
            playsInline
        />
    )
})

export default HlsPlayerMemo
