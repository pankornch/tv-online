import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ReactComponent as PlaySVG } from "@/assets/play.svg"
import { ReactComponent as PauseSVG } from "@/assets/pause.svg"
import { ReactComponent as MuteSVG } from "@/assets/mute.svg"
import { ReactComponent as SpeakerSVG } from "@/assets/speaker.svg"
import { ReactComponent as FullScreenSVG } from "@/assets/full-screen.svg"
import { ReactComponent as LoadingSVG } from "@/assets/loading.svg"

interface Props {
    playerRef: React.MutableRefObject<HTMLVideoElement | null>
}

function PlayButton(props: Props) {
    const [isPlayed, setIsPlayed] = React.useState<boolean>(false)
    const [isShow, setIsShow] = React.useState<boolean>(true)
    const [isMuted, setIsMuted] = React.useState<boolean>(true)
    const [loading, setLoading] = React.useState<boolean>(true)
    const timerRef = React.useRef<NodeJS.Timer>()

    React.useEffect(() => {
        if (!props.playerRef.current) return
        setIsPlayed(!props.playerRef.current.paused)

        props.playerRef.current.onplaying = handlePlay
        props.playerRef.current.onloadeddata = () => setLoading(false)
        props.playerRef.current.onsuspend = console.log
        props.playerRef.current.onerror = console.log

        setIsMuted(props.playerRef.current.muted)
    }, [])

    function handlePlay() {
        setIsPlayed(true)
        timerRef.current = setTimeout(() => {
            setIsShow(false)
        }, 2000)
    }

    function togglePlay() {
        if (loading) return

        props.playerRef.current?.paused
            ? props.playerRef.current.play()
            : props.playerRef.current?.pause()
        setIsPlayed(!isPlayed)
    }

    function handleMouseOver() {
        clearTimeout(timerRef.current)
        setIsShow(true)
    }

    function handleMouseLeave() {
        if (!isPlayed) return
        setIsShow(false)
    }

    function toggleMute(e: React.MouseEvent<HTMLButtonElement>) {
        if (!props.playerRef.current) return
        e.stopPropagation()
        props.playerRef.current.muted = !props.playerRef.current.muted
        setIsMuted(props.playerRef.current.muted)
    }

    function handleFullScreen(e: React.MouseEvent<HTMLButtonElement>) {
        if (!props.playerRef.current) return
        e.stopPropagation()
        props.playerRef.current.requestFullscreen()
    }

    return (
        <motion.div
            onClick={togglePlay}
            className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/25"
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            animate={{
                opacity: isShow ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
        >
            <AnimatePresence>
                {isShow && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex cursor-pointer items-center justify-center rounded-full bg-black/75 p-3 text-white"
                    >
                        {loading ? (
                            <LoadingSVG className="h-8 animate-spin opacity-75" />
                        ) : isPlayed ? (
                            <PauseSVG className="h-8" />
                        ) : (
                            <PlaySVG className="h-8 translate-x-[7.5%]" />
                        )}

                        <div className="absolute bottom-3 right-3 flex items-center gap-x-3">
                            <button onClick={toggleMute}>
                                {isMuted ? (
                                    <MuteSVG className="w-6" />
                                ) : (
                                    <SpeakerSVG className="w-6" />
                                )}
                            </button>
                            <button onClick={handleFullScreen}>
                                <FullScreenSVG className="w-6" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default PlayButton
