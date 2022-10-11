import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"

import axios from "@/configs/axios"
import { EUserRole, IChannel, IChannelChat } from "@/types"
import { Layout, LiveChats, ChannelSection, ToggleMenu } from "@/components"
import useUserID from "@/hooks/useUserID"
import useSocket from "@/hooks/useSocket"
import useUser from "@/hooks/useUser"
import { cls } from "@/utils"

import { ReactComponent as UserSVG } from "@/assets/user.svg"
import { ReactComponent as ChartSVG } from "@/assets/chart.svg"

function ChannelByIdPage() {
    let { id } = useParams()

    const [channel, setChannel] = useState<IChannel | null>(null)
    const [userWatching, setUserWatching] = useState<string[]>([])

    const { user } = useUser()

    const [uid] = useUserID()
    const socket = useSocket()

    async function fetchChannelById(id: string) {
        const res = await axios.get(`channel/${id}`)
        setChannel(res.data)
    }

    useEffect(() => {
        if (!id) return
        fetchChannelById(id)
    }, [id])

    useEffect(() => {
        if (!socket || !id) return

        const channelNsp = `channel|${id}`
        socket
            .emit("init", { uid })
            .emit("watching", { channelID: id })
            .on(channelNsp, (data: string[]) => {
                setUserWatching(data)
            })

        return () => {
            socket.emit("leave_channel", { channelID: id, uid })
            socket.off(channelNsp)
        }
    }, [socket, id])

    return (
        <Layout>
            <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-3">
                <div className="col-span-2">
                    <div className="my-4 flex items-center gap-x-4 text-white">
                        <div className="h-6 w-[2px] bg-slate-100" />
                        <h4>LIVE</h4>
                        {user?.role === EUserRole.ADMIN && (
                            <Link
                                to={`/backoffice/channel/${id}`}
                                className="ml-auto"
                            >
                                <ChartSVG className="h-6 hover:text-orange-500" />
                            </Link>
                        )}
                    </div>
                    {channel && (
                        <ChannelSection
                            channel={channel}
                            userWatching={userWatching}
                        />
                    )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <SideChannel socket={socket} />
                </div>
            </div>
        </Layout>
    )
}

interface SideChannelProps {
    socket?: Socket
}
function SideChannel({ socket }: SideChannelProps) {
    const { id } = useParams()
    const [selectedSide, setSelectedSide] = useState<"SUGGEST" | "CHAT">("CHAT")

    const [chats, setChats] = useState<IChannelChat[]>([])

    const onGetChats = (data: IChannelChat) => {
        setChats((prev) => [...prev, data])
    }

    useEffect(() => {
        setChats([])

        if (!socket || !id) return
        socket.on(`channel_chats|${id}`, onGetChats)
    }, [socket, id])

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
            <>
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
                                />
                            ),
                        },
                    ]}
                />
            </>
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

export default ChannelByIdPage
