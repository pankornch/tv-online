import React, {
    RefObject,
    useEffect,
    useRef,
    useState,
    MouseEvent,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ReactComponent as PlaySVG } from "@/assets/play.svg"
import { ReactComponent as PauseSVG } from "@/assets/pause.svg"
import { ReactComponent as MuteSVG } from "@/assets/mute.svg"
import { ReactComponent as SpeakerSVG } from "@/assets/speaker.svg"
import { ReactComponent as FullScreenSVG } from "@/assets/full-screen.svg"
import { ReactComponent as LoadingSVG } from "@/assets/loading.svg"

interface Props {
    playerRef: RefObject<HTMLVideoElement | null>
}

function PlayButton(props: Props) {
    const [isPlayed, setIsPlayed] = useState<boolean>(false)
    const [isShow, setIsShow] = useState<boolean>(true)
    const [isMuted, setIsMuted] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    const timerRef = useRef<NodeJS.Timer>()

    useEffect(() => {
        listeners()
    }, [props.playerRef.current])

    function listeners() {
        const { playerRef } = props

        if (!playerRef.current) return

        setIsPlayed(!playerRef.current.paused)
        setIsMuted(playerRef.current.muted)

        playerRef.current.onplaying = handlePlay
        playerRef.current.onloadeddata = () => setLoading(false)
        playerRef.current.onsuspend = console.log
        playerRef.current.onerror = console.log
    }

    function handlePlay() {
        setIsPlayed(true)
        timerRef.current = setTimeout(() => {
            setIsShow(false)
        }, 2000)
    }

    function togglePlay(loading: boolean) {
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

    function toggleMute(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()

        if (!props.playerRef.current) return

        props.playerRef.current.muted = !props.playerRef.current.muted
        setIsMuted(props.playerRef.current.muted)
    }

    function handleFullScreen(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()

        if (!props.playerRef.current) return

        props.playerRef.current.requestFullscreen()
    }

    return (
        <motion.div
            onClick={togglePlay.bind(null, loading)}
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
