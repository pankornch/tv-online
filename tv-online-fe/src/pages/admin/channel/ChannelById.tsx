import React, { useState, useRef, useEffect, useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { IChannel, IChannelChat, IChannelLog } from "@/types"
import axios from "@/configs/axios"
import Layout from "@/components/Layout"
import { Player } from "@/components/Player"
import { ReactComponent as UserSVG } from "@/assets/user.svg"

import { cls, compactNumber, getAvatarUrl, getDate } from "@/utils"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import useSocket from "@/hooks/useSocket"
import { Socket } from "socket.io-client"

import LiveChats from "@/components/LiveChats"
import { AnimatePresence, motion } from "framer-motion"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

function AdminChannelByIdPage() {
    let { id } = useParams()

    const [channel, setChannel] = useState<IChannel | null>(null)
    const [userWatching, setUserWatching] = useState<string[]>([])
    const [channelLogs, setChannelLogs] = useState<IChannelLog[]>([])

    const playerRef = useRef<null | HTMLVideoElement>(null)
    const socket = useSocket()

    async function fetchChannelById(id: string) {
        const res = await axios.get(`channel/${id}`)
        setChannel(res.data)
    }

    async function fetchLogs(id: string) {
        try {
            const date = getDate(new Date())
            const res = await axios.get(`admin/channel/log/channel/${id}`, {
                params: { date },
            })
            setChannelLogs(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!id) return
        fetchChannelById(id)
        fetchLogs(id)
    }, [id])

    const logToDatasets = useMemo(() => {
        if (!channelLogs.length) return []

        const result = channelLogs.reduce<number[]>((acc, curr) => {
            const localTime = new Date(curr.createdAt).toLocaleTimeString("th")
            const [h] = localTime.split(":")

            const idx = Number(h)
            if (!acc[idx]) acc[idx] = 0

            acc[idx]++

            return acc
        }, [])

        return result
    }, [channelLogs])

    useEffect(() => {
        if (!socket || !id) return

        const channelNsp = `channel|${id}`

        socket
            .emit("get_users_channel", { channelID: id })
            .on(channelNsp, (data: string[]) => {
                setUserWatching(data)
            })
        return () => {
            socket.off(channelNsp)
        }
    }, [socket, id])

    return (
        <Layout>
            <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2">
                <div className="col-span-1">
                    <div className="my-4 flex items-center gap-x-4">
                        <div className="h-6 w-[2px] bg-slate-100" />
                        <h4 className="text-white">LIVE</h4>
                    </div>

                    {channel && (
                        <div className="">
                            <div className="aspect-video w-full">
                                <Player
                                    url={channel.url}
                                    playerRef={playerRef}
                                    userCount={userWatching.length}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-9 items-start">
                                <div className="col-span-7">
                                    <h4 className="truncate pr-6 font-medium text-white">
                                        {channel.name}: {channel.title}
                                    </h4>
                                    <p className="mt-4 text-gray-400">
                                        {channel.description}
                                    </p>
                                </div>

                                <div className="col-span-2 flex flex-col items-end gap-y-3 text-white">
                                    <div className="flex items-center gap-x-2">
                                        <UserSVG className="h-4" />
                                        <p>
                                            {compactNumber(channel.views)} views
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-span-1 flex flex-col">
                    <SideChannel
                        socket={socket}
                        userWatching={userWatching}
                        datasets={logToDatasets}
                    />
                </div>
            </div>
        </Layout>
    )
}

interface SideChannelProps {
    socket?: Socket
    userWatching: string[]
    datasets: number[]
}
function SideChannel({ socket, userWatching, datasets }: SideChannelProps) {
    const { id } = useParams()

    const [chats, setChats] = useState<IChannelChat[]>([])
    const [selectedSide, setSelectedSide] = useState<"CHART" | "CHAT">("CHAT")

    const chatsRef = useRef<IChannelChat[]>([])

    const onGetChats = (data: IChannelChat) => {
        chatsRef.current.push(data)
        setChats([...chatsRef.current])
    }

    useEffect(() => {
        setChats([])

        if (!socket || !id) return
        fetchChats(id)
        socket.on(`channel_chats|${id}`, onGetChats)
    }, [socket, id])

    async function fetchChats(id: string) {
        try {
            const date = getDate(new Date())
            const res = await axios.get(`admin/channel/chat/${id}`, {
                params: { date },
            })
            chatsRef.current = res.data
            setChats(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const variant = {
        animate: { x: 0, opacity: 1 },
        exit: { opacity: 0 },
    }

    return (
        <>
            <div className="mb-6 flex items-center gap-x-3 text-white">
                <div className="h-6 w-[2px] bg-slate-100" />
                <div className="divide-x">
                    <button onClick={setSelectedSide.bind(null, "CHART")}>
                        <h5
                            className={cls(
                                "px-3 underline-offset-4",
                                selectedSide === "CHART" &&
                                    "text-orange-500 underline"
                            )}
                        >
                            Logs
                        </h5>
                    </button>
                    <button onClick={setSelectedSide.bind(null, "CHAT")}>
                        <h5
                            className={cls(
                                "px-3 underline-offset-4",
                                selectedSide === "CHAT" &&
                                    "text-orange-500 underline"
                            )}
                        >
                            Live Chats
                        </h5>
                    </button>
                </div>
            </div>
            <AnimatePresence mode="wait">
                {selectedSide === "CHART" ? (
                    <motion.div
                        key="CHART"
                        variants={variant}
                        transition={{ duration: 0.2 }}
                        initial="exit"
                        animate="animate"
                        exit="exit"
                    >
                        <ChannelChart datasets={datasets} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="CHAT"
                        variants={variant}
                        transition={{ duration: 0.2 }}
                        initial="exit"
                        animate="animate"
                        exit="exit"
                    >
                        <LiveChats
                            channelID={id!}
                            socket={socket}
                            chats={chats}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-12 rounded-lg bg-neutral-700 p-4 text-neutral-400 shadow-lg">
                <p className="text-right text-gray-400">
                    {compactNumber(userWatching.length)} USERS WATCHING
                </p>
                <div className="mt-6 grid max-h-96 grid-cols-2 gap-6 overflow-y-auto">
                    {userWatching.map((id) => (
                        <Link
                            to={`/backoffice/user/${id}`}
                            key={id}
                            className="flex items-center gap-x-3"
                        >
                            <img
                                className="h-8 w-8 rounded-full"
                                src={getAvatarUrl(id)}
                                alt={id}
                            />
                            <p>{id}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

interface ChannelChartProps {
    datasets: number[]
}

function ChannelChart({ datasets }: ChannelChartProps) {
    const chartLabels = useMemo(() => {
        const labels: string[] = []

        for (let i = 0; i < 24; i++) {
            const h = i % 12
            labels.push(`${h === 0 ? "12" : h} ${i < 12 ? "AM" : "PM"} `)
        }

        return labels
    }, [])
    return (
        <div className="rounded-lg bg-neutral-700 p-2 shadow-lg">
            <Line
                data={{
                    labels: chartLabels,
                    datasets: [
                        {
                            label: "User counts",
                            data: datasets,
                            borderColor: "#f97316",
                            backgroundColor: "#fed7aa",
                        },
                    ],
                }}
            />
        </div>
    )
}

export default AdminChannelByIdPage
