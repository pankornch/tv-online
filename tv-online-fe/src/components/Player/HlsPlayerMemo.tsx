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
            onError={alert}
            hlsConfig={{
                autoStartLoad: true,
            }}
            playsInline
        />
    )
})

export default HlsPlayerMemo
