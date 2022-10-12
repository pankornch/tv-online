import React, { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"

import axios from "@/configs/axios"
import { EUserRole, IChannel } from "@/types"
import { Layout, ChannelSection, ChannelNotFound } from "@/components"
import useUserID from "@/hooks/useUserID"
import useSocket from "@/hooks/useSocket"
import useUser from "@/hooks/useUser"
import SideChannel from "@/components/SideChannel"

import { ReactComponent as ChartSVG } from "@/assets/chart.svg"

function ChannelByIdPage() {
    let { id } = useParams()

    const [channel, setChannel] = useState<IChannel | null>(null)
    const [userWatching, setUserWatching] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const { user } = useUser()

    const [uid] = useUserID()
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

    useEffect(() => {
        if (!id) return
        fetchChannelById(id)
    }, [id])

    useEffect(() => {
        if (!socket || !id || !isFound) return

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
    }, [socket, id, isFound])

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
                    {isFound ? (
                        <ChannelSection
                            channel={channel!}
                            userWatching={userWatching}
                        />
                    ) : (
                        <ChannelNotFound channelID={id} />
                    )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <SideChannel socket={socket} isFound={isFound} />
                </div>
            </div>
        </Layout>
    )
}

export default ChannelByIdPage
