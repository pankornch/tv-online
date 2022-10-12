import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"

import { IChannelChat, IChannel } from "@/types"
import { cls } from "@/utils"
import LiveChats from "../LiveChats"
import ToggleMenu from "../ToggleMenu"
import axios from "@/configs/axios"

import { ReactComponent as UserSVG } from "@/assets/user.svg"

interface SideChannelProps {
    socket?: Socket
    isFound: boolean
}
function SideChannel({ socket, isFound }: SideChannelProps) {
    const { id } = useParams()
    const [selectedSide, setSelectedSide] = useState<"SUGGEST" | "CHAT">("CHAT")

    const [chats, setChats] = useState<IChannelChat[]>([])

    const onGetChats = (data: IChannelChat) => {
        setChats((prev) => [...prev, data])
    }

    useEffect(() => {
        setChats([])

        if (!socket || !id || !isFound) return
        socket.on(`channel_chats|${id}`, onGetChats)
    }, [socket, id, isFound])

    return (
        <>
            <div className="my-4 mb-4 flex items-center gap-x-1 text-white">
                <div className="h-6 w-[2px] bg-slate-100" />
                <div className="divide-x">
                    <button onClick={setSelectedSide.bind(null, "CHAT")}>
                        <h5
                            className={cls(
                                "px-2 underline-offset-4",
                                selectedSide === "CHAT" &&
                                    "text-orange-500 underline"
                            )}
                        >
                            Live Chats
                        </h5>
                    </button>
                    <button onClick={setSelectedSide.bind(null, "SUGGEST")}>
                        <h5
                            className={cls(
                                "px-2 underline-offset-4",
                                selectedSide === "SUGGEST" &&
                                    "text-orange-500 underline"
                            )}
                        >
                            Suggest Channels
                        </h5>
                    </button>
                </div>
            </div>
            <ToggleMenu
                value={selectedSide}
                menus={[
                    { key: "SUGGEST", children: <SuggestChannels /> },
                    {
                        key: "CHAT",
                        children: (
                            <LiveChats
                                channelID={id!}
                                socket={socket}
                                chats={chats}
                                disabled={!isFound}
                            />
                        ),
                    },
                ]}
            />
        </>
    )
}

function SuggestChannels() {
    const [suggestChannels, setSuggestChannels] = useState<IChannel[]>([])

    let { id } = useParams()

    async function fetchSuggestChannels(channelID: string) {
        const res = await axios.get("/channel/suggest", {
            params: {
                channelID,
            },
        })
        setSuggestChannels(res.data as IChannel[])
    }

    useEffect(() => {
        if (!id) return
        fetchSuggestChannels(id)
    }, [id])

    return (
        <div className="flex flex-col gap-y-6">
            {suggestChannels.map((channel) => (
                <Link key={channel.id} to={`/channel/${channel.id}`}>
                    <div className="flex cursor-pointer gap-6">
                        <img
                            src={channel.image}
                            className="aspect-video h-28 border border-gray-600 object-cover"
                        />
                        <div className="flex flex-col justify-between border-t border-gray-500 py-2 text-white">
                            <div>
                                <p className="font-bold">{channel.name}</p>
                                <p className="line-clamp-2">
                                    {channel.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-1">
                                <UserSVG className="h-4" />
                                <p>{channel.views} views</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
export { default as AdminSideChannel } from "./Admin"
export default SideChannel
