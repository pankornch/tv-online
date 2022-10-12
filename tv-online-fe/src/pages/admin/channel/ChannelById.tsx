import React, { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
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

import axios from "@/configs/axios"
import {
    Layout,
    ChannelSection,
    ChannelNotFound,
    AdminSideChannel,
} from "@/components"
import { getDate } from "@/utils"

import useSocket from "@/hooks/useSocket"
import useUserID from "@/hooks/useUserID"
import { IChannel, IChannelLog } from "@/types"

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
    const [uid] = useUserID()

    const [channel, setChannel] = useState<IChannel | null>(null)
    const [userWatching, setUserWatching] = useState<string[]>([])
    const [channelLogs, setChannelLogs] = useState<IChannelLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const socket = useSocket()

    async function fetchChannelById(id: string) {
        setLoading(true)
        const res = await axios.get(`channel/${id}`)
        setChannel(res.data)
        setLoading(false)
    }

    const isFound = useMemo(() => {
        return Boolean(!loading && channel)
    }, [loading, channel])

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

    useEffect(() => {
        if (!socket || !id || !isFound) return

        const channelNsp = `channel|${id}`

        socket
            .emit("init", { uid })
            .emit("get_users_channel", { channelID: id })
            .on(channelNsp, (data: string[]) => {
                setUserWatching(data)
            })
        return () => {
            socket.off(channelNsp)
        }
    }, [socket, id, isFound])

    return (
        <Layout>
            <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-3">
                <div className="col-span-2">
                    <div className="my-4 flex items-center gap-x-4">
                        <div className="h-6 w-[2px] bg-slate-100" />
                        <h4 className="text-white">LIVE</h4>
                    </div>

                    {channel && !loading ? (
                        <ChannelSection
                            channel={channel}
                            userWatching={userWatching}
                        />
                    ) : (
                        <ChannelNotFound channelID={id} />
                    )}
                </div>
                <div className="col-span-1 flex flex-col">
                    <AdminSideChannel
                        socket={socket}
                        userWatching={userWatching}
                        channelLogs={channelLogs}
                        isFound={isFound}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default AdminChannelByIdPage
