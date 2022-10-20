import React, { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Fuse from "fuse.js"

import {
    ChannelCard,
    Layout,
    ChannelGridContainer,
    StatusCard,
    ModalAddChannel,
    ModalEditChannel,
} from "@/components"
import axios from "@/configs/axios"
import { IChannel } from "@/types"
import useSocket from "@/hooks/useSocket"
import { debounce, compactNumber, cloneObj } from "@/utils"

import { ReactComponent as EditSVG } from "@/assets/edit.svg"
import { ReactComponent as ChartSVG } from "@/assets/chart.svg"
import { ReactComponent as UserSVG } from "@/assets/user-solid.svg"
import { ReactComponent as TvSVG } from "@/assets/tv-solid.svg"

function BackofficeIndexPage() {
    const [channels, setChannels] = useState<IChannel[]>([])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [usersOnline, setUsersOnline] = useState<string[]>([])
    const [searchText, setSeachText] = useState<string>("")
    const [currentChannel, setCurrentChannel] = useState<IChannel | null>(null)

    const navigate = useNavigate()

    function handleOpenModal() {
        setOpenModal(true)
    }

    function handleCloseModal() {
        setOpenModal(false)
    }

    useEffect(() => {
        fetchChannels()
    }, [])

    async function fetchChannels() {
        const res = await axios.get("/channel")
        setChannels(res.data as IChannel[])
    }

    function handleSubmitChannel(
        channels: IChannel[],
        channel: IChannel | null,
        type: "UPDATE" | "DELETE" | "CREATE"
    ) {
        const idx = channels.findIndex((c) => c.id === channel?.id)
        const cloneChannels = cloneObj(channels)

        if (type === "UPDATE") {
            cloneChannels[idx] = channel!
        } else if (type === "CREATE") {
            cloneChannels.push(channel!)
        } else {
            cloneChannels.splice(idx, 1)
            console.log(cloneChannels.length)
        }
        setChannels(cloneChannels)
    }

    const debounceSearch = useMemo(() => {
        return debounce((e: ChangeEvent<HTMLInputElement>) =>
            setSeachText(e.target.value)
        )
    }, [])

    const getChannels = useMemo(() => {
        if (!searchText) return channels

        const fuse = new Fuse(channels, {
            keys: ["name", "title", "description"],
            threshold: 0.6,
        })

        const result = fuse.search(searchText)
        return result.map((e) => e.item)
    }, [channels, channels.length, searchText])

    function handleNavigate(baseUrl: string) {
        return (channel: IChannel) => {
            navigate(`${baseUrl}/${channel.id}`)
        }
    }

    function handleClickEditChannel(channel: IChannel) {
        setCurrentChannel(channel)
        handleOpenModal()
    }

    useSocket((socket) => {
        socket
            .emit("get_users_online")
            .on("users_online", (users: string[]) => {
                setUsersOnline(users)
            })
        return () => {
            socket.off("users_online")
        }
    })

    return (
        <Layout>
            <div className="space-y-12">
                <div className="grid grid-cols-12 items-center justify-end gap-x-3 gap-y-6">
                    <div className="col-span-1 hidden md:col-span-3 md:block"></div>
                    <input
                        className="input col-span-12 sm:col-span-8 md:col-span-6"
                        placeholder="Search channel"
                        onChange={debounceSearch}
                    />
                    <div className="col-span-12 flex justify-start sm:col-span-4 md:col-span-3 md:justify-end">
                        <ModalAddChannel
                            onSubmit={handleSubmitChannel.bind(null, channels)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    <StatusCard>
                        <UserSVG className="h-20  text-green-500" />
                        <div className="flex items-center gap-x-3  text-green-500">
                            <div className="relative">
                                <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-green-300" />
                                <div className="h-4 w-4 rounded-full  bg-green-500" />
                            </div>
                            <h4 className="font-medium">
                                Total Online:{" "}
                                {compactNumber(usersOnline.length)} users
                            </h4>
                        </div>
                    </StatusCard>

                    <StatusCard>
                        <TvSVG className="h-20 text-orange-500" />
                        <h4 className="font-medium text-orange-500">
                            Total Channels: {compactNumber(channels.length)}{" "}
                            channels
                        </h4>
                    </StatusCard>
                </div>

                <ChannelGridContainer>
                    {getChannels.map((channel) => (
                        <ChannelCard
                            key={channel.id}
                            channel={channel}
                            action={
                                <>
                                    <button
                                        className="transition-all hover:scale-125"
                                        onClick={handleNavigate(
                                            "./channel"
                                        ).bind(null, channel)}
                                    >
                                        <ChartSVG className="h-8 text-white" />
                                    </button>
                                    <button
                                        className="transition-all hover:scale-125"
                                        onClick={handleClickEditChannel.bind(
                                            null,
                                            channel
                                        )}
                                    >
                                        <EditSVG className="h-8 text-white" />
                                    </button>
                                </>
                            }
                            onClick={handleNavigate("/channel")}
                        />
                    ))}
                </ChannelGridContainer>
            </div>
            <ModalEditChannel
                open={openModal}
                currentChannel={currentChannel}
                onClose={handleCloseModal}
                onSubmit={handleSubmitChannel.bind(null, channels)}
            />
        </Layout>
    )
}

export default BackofficeIndexPage
