import React, { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Fuse from "fuse.js"
import Swal from "sweetalert2"

import { ChannelCard, Modal, Layout, ImageUploader } from "@/components"
import axios from "@/configs/axios"
import { IChannel } from "@/types"
import useSocket from "@/hooks/useSocket"
import {
    cloneObj,
    handleUploadImage,
    debounce,
    compactNumber,
    setStateInputObj,
} from "@/utils"

import { ReactComponent as AddSVG } from "@/assets/add.svg"
import { ReactComponent as CloseSVG } from "@/assets/close.svg"
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

    const socket = useSocket()

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
        channel: IChannel | null,
        type: "UPDATE" | "DELETE" | "CREATE"
    ) {
        const idx = channels.findIndex((c) => c.id === channel?.id)
        const cloneChannels = JSON.parse(JSON.stringify(channels))

        if (type === "UPDATE") {
            cloneChannels[idx] = channel
        } else if (type === "CREATE") {
            cloneChannels.push(channel)
        } else {
            cloneChannels.splice(idx, 1)
            console.log(cloneChannels.length)
        }
        setChannels(cloneChannels)
    }

    const debounceSearch = React.useMemo(() => {
        return debounce((e: ChangeEvent<HTMLInputElement>) =>
            setSeachText(e.target.value)
        )
    }, [])

    const getChannels = React.useMemo(() => {
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

    useEffect(() => {
        if (!socket) return

        socket
            .emit("get_users_online")
            .on("users_online", (users: string[]) => {
                setUsersOnline(users)
            })
    }, [socket])

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
                        <ModalAddChannel onSubmit={handleSubmitChannel} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    <div className="flex items-center gap-x-6 rounded-lg bg-neutral-700 p-4 text-green-500">
                        <UserSVG className="h-20" />
                        <div className="flex items-center gap-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-green-300" />
                                <div className="h-4 w-4 rounded-full  bg-green-500" />
                            </div>
                            <h4 className="font-medium">
                                Total Online:{" "}
                                {compactNumber(usersOnline.length)} users
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-6 rounded-lg bg-neutral-700 p-4 text-orange-500">
                        <TvSVG className="h-20" />
                        <h4 className="font-medium">
                            Total Channels: {compactNumber(channels.length)}{" "}
                            channels
                        </h4>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 xl:grid-cols-3">
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
                </div>
            </div>
            <ModalEditChannel
                open={openModal}
                currentChannel={currentChannel}
                onClose={handleCloseModal}
                onSubmit={handleSubmitChannel}
            />
        </Layout>
    )
}

interface ModalEditChannelProps {
    open: boolean
    onClose: (status: boolean) => void
    currentChannel: IChannel | null
    onSubmit: (channel: IChannel | null, type: "UPDATE" | "DELETE") => void
}

function ModalEditChannel(props: ModalEditChannelProps) {
    const [currentChannel, setCurrentChannel] = useState<IChannel | null>(null)
    const [imageMapper, setImageMapper] = useState<Record<string, File>>({})

    useEffect(() => {
        if (props.currentChannel) {
            setCurrentChannel(cloneObj(props.currentChannel))
        }
    }, [props.currentChannel])

    async function handleUpdateChannel(e: FormEvent) {
        e.preventDefault()
        if (!currentChannel) return

        const body: Partial<IChannel> = {
            name: currentChannel.name,
            title: currentChannel.title,
            description: currentChannel.description,
            url: currentChannel.url,
            image: currentChannel.image,
        }

        if (Object.values(imageMapper).length) {
            const res = await Promise.all(
                Object.entries(imageMapper).map(async ([key, file]) => [
                    key,
                    await handleUploadImage(file),
                ])
            )

            res.forEach(([key, url]) => (body[key as keyof IChannel] = url.url))
        }

        try {
            const willSave = await Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`,
            })

            if (!willSave.isConfirmed) return

            await axios.patch(`/admin/channel/${currentChannel.id}`, body)
            Swal.fire({ title: "Saved!", icon: "success" })
            props.onSubmit(currentChannel, "UPDATE")
            props.onClose?.call(null, false)
        } catch (error: any) {
            Swal.fire({ title: "Error!", icon: "error", text: error.message })
        }
    }

    async function handleDeleteChannel() {
        if (!currentChannel) return
        try {
            const willDelete = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
            })

            if (!willDelete.isConfirmed) return

            await axios.delete(`/admin/channel/${currentChannel.id}`)
            Swal.fire({ title: "Deleted!", icon: "success" })
            props.onSubmit(null, "DELETE")
            props.onClose.call(null, false)
        } catch (error: any) {
            Swal.fire({ title: "Error!", icon: "error", text: error.message })
        }
    }

    function handleImageChange(url: string, file: File) {
        const cloneChannel = cloneObj(currentChannel!)
        cloneChannel.image = url
        setCurrentChannel(cloneChannel)
        handleUploadImage(file)
        imageMapper["image"] = file
        setImageMapper(imageMapper)
    }

    return (
        <ModalBaseChannel
            title="Edit Channel"
            open={props.open}
            onClose={props.onClose}
        >
            <form
                onSubmit={handleUpdateChannel}
                className="mt-6 flex flex-col gap-y-6"
            >
                <label>
                    <span>ID</span>
                    <input
                        className="input"
                        name="id"
                        value={currentChannel?.id || ""}
                        disabled
                    />
                </label>
                <label>
                    <span>Cover Image</span>
                    <ImageUploader
                        value={currentChannel?.image}
                        onChange={handleImageChange}
                    />
                </label>
                <label>
                    <span>Name</span>
                    <input
                        className="input"
                        name="name"
                        value={currentChannel?.name || ""}
                        onChange={setStateInputObj(setCurrentChannel)}
                    />
                </label>
                <label>
                    <span>URL</span>
                    <input
                        className="input"
                        name="url"
                        value={currentChannel?.url || ""}
                        onChange={setStateInputObj(setCurrentChannel)}
                    />
                </label>
                <label>
                    <span>Title</span>
                    <input
                        className="input"
                        name="title"
                        value={currentChannel?.title || ""}
                        onChange={setStateInputObj(setCurrentChannel)}
                    />
                </label>
                <label>
                    <span>Description</span>
                    <textarea
                        className="input focus:transition-none"
                        name="description"
                        value={currentChannel?.description || ""}
                        onChange={setStateInputObj(setCurrentChannel)}
                    />
                </label>
                <div className="space-y-3">
                    <button
                        type="submit"
                        className="button bg-orange-500 text-white"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="button bg-gray-500 text-white"
                        onClick={props.onClose?.bind(null, false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="button bg-red-500 text-white"
                        onClick={handleDeleteChannel}
                    >
                        Delete
                    </button>
                </div>
            </form>
        </ModalBaseChannel>
    )
}

interface ModalAddChannelProps {
    onSubmit: (
        channel: IChannel | null,
        type: "UPDATE" | "DELETE" | "CREATE"
    ) => void
}
function ModalAddChannel(props: ModalAddChannelProps) {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [currentChannel, setCurrentChannel] = useState<Partial<IChannel>>({})
    const [imageMapper, setImageMapper] = useState<Record<string, File>>({})

    function handleOpenModal() {
        setOpenModal(true)
    }

    function handleCloseModal() {
        setOpenModal(false)
        setCurrentChannel({})
    }

    function handleImageChange(url: string, file: File) {
        const cloneChannel = cloneObj(currentChannel!)
        cloneChannel.image = url
        setCurrentChannel(cloneChannel)
        imageMapper["image"] = file
        setImageMapper(imageMapper)
    }

    async function handleCreateChannel(e: FormEvent) {
        e.preventDefault()
        const body = Object.assign(currentChannel)

        if (Object.values(imageMapper).length) {
            const res = await Promise.all(
                Object.entries(imageMapper).map(async ([key, file]) => [
                    key,
                    await handleUploadImage(file),
                ])
            )

            res.forEach(([key, url]) => (body[key as keyof IChannel] = url.url))
        }

        try {
            const res = await axios.post("/admin/channel", body)
            Swal.fire({ title: "Created!", icon: "success" })
            props.onSubmit(res.data, "CREATE")
            handleCloseModal()
        } catch (error: any) {
            const { message } = error?.response.data || error
            Swal.fire({ title: "Error!", icon: "error", text: message })
        }
    }

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="group flex items-center gap-x-1 rounded-md py-1 pl-2 pr-4 text-white transition-all hover:scale-105 hover:bg-white/25"
            >
                <AddSVG className="h-6" />
                <span className="underline-offset-4 transition-all group-hover:underline">
                    Add new channel
                </span>
            </button>

            <ModalBaseChannel
                title="Add Channel"
                open={openModal}
                onClose={handleCloseModal}
            >
                <form
                    onSubmit={handleCreateChannel}
                    className="mt-6 flex flex-col gap-y-6"
                >
                    <label>
                        <span>Cover Image</span>
                        <ImageUploader
                            value={currentChannel?.image}
                            onChange={handleImageChange}
                        />
                    </label>
                    <label>
                        <span>Name</span>
                        <input
                            className="input"
                            name="name"
                            value={currentChannel?.name || ""}
                            onChange={setStateInputObj(setCurrentChannel)}
                        />
                    </label>
                    <label>
                        <span>URL</span>
                        <input
                            className="input"
                            name="url"
                            value={currentChannel?.url || ""}
                            onChange={setStateInputObj(setCurrentChannel)}
                        />
                    </label>
                    <label>
                        <span>Title</span>
                        <input
                            className="input"
                            name="title"
                            value={currentChannel?.title || ""}
                            onChange={setStateInputObj(setCurrentChannel)}
                        />
                    </label>
                    <label>
                        <span>Description</span>
                        <textarea
                            className="input focus:transition-none"
                            name="description"
                            value={currentChannel?.description || ""}
                            onChange={setStateInputObj(setCurrentChannel)}
                        />
                    </label>
                    <div className="space-y-3">
                        <button
                            type="submit"
                            className="button bg-orange-500 text-white"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="button bg-gray-500 text-white"
                            onClick={handleCloseModal.bind(null, false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </ModalBaseChannel>
        </>
    )
}

interface ModalBaseChannelProps {
    open: boolean
    onClose: (status: boolean) => void
    title: string
    children: React.ReactNode
}

function ModalBaseChannel(props: ModalBaseChannelProps) {
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <div className="relative mx-auto mt-24 h-[70vh] max-h-[1000px] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6 px-4">
                <button
                    onClick={props.onClose.bind(null, false)}
                    className="absolute top-3 right-6 rounded-full bg-red-100 p-1 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                >
                    <CloseSVG className="h-6 w-6" />
                </button>
                <h4 className="text-center font-medium">{props.title}</h4>
                <>{props.children}</>
            </div>
        </Modal>
    )
}

export default BackofficeIndexPage
