import React from "react"
import Swal from "sweetalert2"

import axios from "@/configs/axios"
import { IChannel } from "@/types"
import { cloneObj, handleUploadImage, setStateInputObj } from "@/utils"
import Modal from "."
import ImageUploader from "../ImageUploader"

import { ReactComponent as AddSVG } from "@/assets/add.svg"
import { ReactComponent as CloseSVG } from "@/assets/close.svg"

interface ModalBaseChannelProps {
    open: boolean
    onClose: (status: boolean) => void
    title: string
    children: React.ReactNode
}

export function ModalBaseChannel(props: ModalBaseChannelProps) {
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

interface ModalAddChannelProps {
    onSubmit: (
        channel: IChannel | null,
        type: "UPDATE" | "DELETE" | "CREATE"
    ) => void
}
export function ModalAddChannel(props: ModalAddChannelProps) {
    const [openModal, setOpenModal] = React.useState<boolean>(false)
    const [currentChannel, setCurrentChannel] = React.useState<
        Partial<IChannel>
    >({})
    const [imageMapper, setImageMapper] = React.useState<Record<string, File>>(
        {}
    )

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

    async function handleCreateChannel(e: React.FormEvent) {
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

interface ModalEditChannelProps {
    open: boolean
    onClose: (status: boolean) => void
    currentChannel: IChannel | null
    onSubmit: (channel: IChannel | null, type: "UPDATE" | "DELETE") => void
}

export function ModalEditChannel(props: ModalEditChannelProps) {
    const [currentChannel, setCurrentChannel] = React.useState<IChannel | null>(
        null
    )
    const [imageMapper, setImageMapper] = React.useState<Record<string, File>>(
        {}
    )

    React.useEffect(() => {
        if (props.currentChannel) {
            setCurrentChannel(cloneObj(props.currentChannel))
        }
    }, [props.currentChannel])

    async function handleUpdateChannel(e: React.FormEvent) {
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
