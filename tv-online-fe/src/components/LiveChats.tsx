import useUserID from "@/hooks/useUserID"
import { IChannelChat } from "@/types"
import { dateTimeFormat, getAvatarUrl, setStateInput } from "@/utils"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import ProgressArc, { ProgressArcRef } from "./ProgressArc"
import { ReactComponent as SendSVG } from "@/assets/send.svg"

interface LiveChatsProps {
    socket?: Socket
    chats: IChannelChat[]
    channelID: string
    disabled?: boolean
}
function LiveChats({ socket, chats, channelID, disabled }: LiveChatsProps) {
    const [uid] = useUserID()

    const [isCooldown, setIsCooldown] = useState<boolean>(false)
    const [text, setText] = useState<string>("")
    const chatContainerRef = useRef<HTMLDivElement | null>(null)
    const progressArcRef = useRef<ProgressArcRef | null>(null)

    useEffect(() => {
        handleScrollToBottom(chatContainerRef.current)
    }, [chats.length])

    function handleSubmit(text: string, e: React.FormEvent) {
        e.preventDefault()

        if (!text.trim()) return

        handleSendComment(channelID, text)
        setText("")
    }

    function handleSendComment(channelID: string, text: string) {
        socket?.emit("send_chat", { channelID, text })
        progressArcRef.current?.startCount(3000)
        setIsCooldown(true)
    }

    function handleScrollToBottom(target: HTMLDivElement | null) {
        if (!target) return

        target.scrollTo({ top: target.scrollHeight, behavior: "smooth" })
    }

    return (
        <div className="relative overflow-hidden rounded-lg">
            <div
                ref={chatContainerRef}
                className="h-[32rem] overflow-y-auto overflow-x-hidden overscroll-contain bg-neutral-700 px-6 py-4"
            >
                <div className="flex flex-col gap-y-4 pb-20">
                    {chats.map((chat) => (
                        <ChatTextCard key={chat.id} chat={chat} />
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full border-t border-neutral-500 bg-neutral-700 p-4">
                    <form
                        onSubmit={handleSubmit.bind(null, text)}
                        className="relative"
                    >
                        <img
                            src={getAvatarUrl(uid)}
                            className="avatar-rounded absolute left-2 top-1/2 h-8 -translate-y-1/2"
                        />
                        <input
                            className="input bg-neutral-700 px-12 text-white"
                            placeholder="Say something..."
                            value={text}
                            onChange={setStateInput(setText)}
                            autoFocus
                            disabled={disabled}
                        />

                        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-x-2">
                            <ProgressArc
                                ms={3000}
                                radius={24}
                                color="rgba(249 115 22)"
                                onCooldownEnd={setIsCooldown.bind(null, false)}
                                startOnMount={false}
                                ref={progressArcRef}
                            />

                            <button
                                type="submit"
                                className="disabled:cursor-not-allowed"
                                disabled={isCooldown}
                            >
                                <SendSVG className="h-6 text-white transition-all hover:text-orange-500" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

interface ChatTextCardProps {
    chat: IChannelChat
}
function ChatTextCard({ chat }: ChatTextCardProps) {
    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{
                duration: 0.2,
            }}
            className="flex gap-x-4 text-white"
        >
            <img
                src={getAvatarUrl(chat.uid)}
                className="avatar-rounded h-8 w-8"
            />
            <div className="grow">
                <div className="flex items-center justify-between text-neutral-400">
                    <p className="text-sm">{chat.uid}</p>
                    <p className="text-xs">
                        {dateTimeFormat(chat.createdAt, {
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </p>
                </div>
                <p className="max-w-[12rem] break-words leading-4">
                    {chat.text}
                </p>
            </div>
        </motion.div>
    )
}

export default LiveChats
