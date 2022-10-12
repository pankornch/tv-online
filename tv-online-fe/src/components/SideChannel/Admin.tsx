import { useState, useEffect, useMemo } from "react"
import { IChannelLog, IChannelChat } from "@/types"
import { Line } from "react-chartjs-2"
import { useParams, Link } from "react-router-dom"
import { Socket } from "socket.io-client"

import {
    getDate,
    cls,
    compactNumber,
    getAvatarUrl,
    dateTimeFormat,
} from "@/utils"

import axios from "@/configs/axios"
import LiveChats from "../LiveChats"
import ToggleMenu from "../ToggleMenu"

interface AdminSideChannelProps {
    socket?: Socket
    userWatching: string[]
    channelLogs: IChannelLog[]
    isFound: boolean
}
function AdminSideChannel({
    socket,
    userWatching,
    channelLogs,
    isFound,
}: AdminSideChannelProps) {
    const { id } = useParams()

    const [chats, setChats] = useState<IChannelChat[]>([])
    const [selectedSide, setSelectedSide] = useState<"CHART" | "CHAT">("CHAT")

    const onGetChats = (data: IChannelChat) => {
        setChats((prev) => [...prev, data])
    }

    useEffect(() => {
        if (!socket || !id || !isFound) return

        fetchChats(id)
        socket.on(`channel_chats|${id}`, onGetChats)
    }, [socket, id, isFound])

    async function fetchChats(id: string) {
        try {
            const date = getDate(new Date())
            const res = await axios.get(`admin/channel/chat/${id}`, {
                params: { date },
            })
            setChats(res.data)
        } catch (error) {
            console.log(error)
        }
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

            <ToggleMenu
                value={selectedSide}
                menus={[
                    {
                        key: "CHART",
                        children: (
                            <ChannelChart
                                channelLogs={channelLogs}
                                userWatching={userWatching}
                            />
                        ),
                    },
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

interface ChannelChartProps {
    userWatching: string[]
    channelLogs: IChannelLog[]
}

function ChannelChart({ userWatching, channelLogs }: ChannelChartProps) {
    const chartLabels = useMemo(() => {
        const labels: string[] = []

        for (let i = 0; i < 24; i++) {
            const h = i % 12
            labels.push(`${h === 0 ? "12" : h} ${i < 12 ? "AM" : "PM"}`)
        }

        return labels
    }, [])

    const datasets = useMemo(() => {
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

    return (
        <>
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

            <div className="mt-12 rounded-lg bg-neutral-700 p-4 text-neutral-400 shadow-lg">
                <p className="text-right text-gray-400">
                    {compactNumber(channelLogs.length)} Logs
                </p>
                <div className="mt-6 grid max-h-96 gap-6 overflow-y-auto">
                    {channelLogs.map((log) => (
                        <Link
                            to={`/backoffice/user/${log.uid}`}
                            key={log.id}
                            className="flex items-center gap-x-3"
                        >
                            <img
                                className="h-8 w-8 rounded-full"
                                src={getAvatarUrl(log.uid ?? "")}
                                alt={log.uid}
                            />
                            <p>{log.uid}</p>

                            <p className="ml-auto text-sm">
                                {dateTimeFormat(log.createdAt, {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default AdminSideChannel
