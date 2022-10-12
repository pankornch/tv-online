import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Fuse from "fuse.js"

import axios from "@/configs/axios"
import { IChannel, IHotChannel } from "@/types"
import { debounce } from "@/utils"
import { ChannelCard, ChannelGridContainer, Layout } from "@/components"
import useSocket from "./hooks/useSocket"

function App() {
    const [channels, setChannels] = useState<IChannel[]>([])
    const [hotChannels, setHotChannels] = useState<IHotChannel[]>([])
    const [searchText, setSeachText] = useState<string>("")

    const navigate = useNavigate()

    // const socket = useSocket()

    useEffect(() => {
        fetchChannels()
    }, [])

    async function fetchChannels() {
        const res = await axios.get("/channel")
        setChannels(res.data as IChannel[])
    }

    function handleNavigate(channel: IChannel) {
        navigate(`/channel/${channel.id}`)
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
    }, [channels, searchText])

    useSocket((socket) => {
        socket.emit("get_hot_channels").on("hot_channels", (data) => {
            setHotChannels(data)
        })
    })

    return (
        <Layout>
            <div className="pb-6">
                <div className="mb-12 flex justify-center">
                    <input
                        onChange={debounceSearch}
                        className="input w-full md:w-3/5"
                        placeholder="Search channel"
                    />
                </div>
                <div>
                    {hotChannels.length > 0 && (
                        <div className="pb-12">
                            <h3 className="pb-6 text-white">HOT CHANNELS</h3>
                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
                                {hotChannels.map((ch) => (
                                    <ChannelCard
                                        key={ch.channel.id}
                                        channel={ch.channel}
                                        hotChannel={ch}
                                        onClick={handleNavigate.bind(
                                            null,
                                            ch.channel
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <h3 className="mb-6 text-white">CHANNELS</h3>
                <ChannelGridContainer>
                    {getChannels.map((channel) => (
                        <ChannelCard
                            key={channel.id}
                            channel={channel}
                            onClick={handleNavigate}
                        />
                    ))}
                </ChannelGridContainer>
            </div>
        </Layout>
    )
}

export default App
