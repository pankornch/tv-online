import Layout from "@/components/Layout"
import axios from "@/configs/axios"
import { IChannelLog } from "@/types"
import { dateTimeFormat, getAvatarUrl } from "@/utils"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ReactComponent as ArrowRightSVG } from "@/assets/arrow-right.svg"

function AdminUserByIdPage() {
    const { id } = useParams()

    const [userLogs, setUserLogs] = useState<IChannelLog[]>([])

    async function fetchUserLogs(id: string) {
        const res = await axios.get(`/admin/channel/log/user/${id}`)
        console.log(res.data)
        setUserLogs(res.data)
    }

    useEffect(() => {
        if (!id) return
        fetchUserLogs(id)
    }, [id])

    return (
        <Layout>
            <div className="pb-12">
                {id && (
                    <>
                        <div className="mb-6 flex items-center gap-x-3 text-white">
                            <img
                                src={getAvatarUrl(id)}
                                className="h-23 h-32 rounded-full object-cover"
                            />
                            <div>
                                <h5>ID: {id}</h5>
                                <p className="mt-3 text-sm">
                                    Found {userLogs.length} logs
                                </p>
                            </div>
                        </div>
                        <div className="flex max-h-screen flex-col gap-y-6 overflow-y-auto rounded-lg bg-white">
                            <div className="sticky top-0 grid grid-cols-10 gap-x-12 border-b bg-white py-4 px-6 pb-3 text-lg font-medium">
                                <p>No.</p>
                                <p className="col-span-2">Cover</p>
                                <p className="col-span-2">Name</p>
                                <p className="col-span-2">Title</p>
                                <p className="col-span-2">Date Time</p>
                            </div>
                            {userLogs.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-10 gap-x-12 py-4 px-6 transition-all hover:bg-gray-100"
                                >
                                    <p className="col-span-1">{index + 1}</p>
                                    <img
                                        src={item.channel.image}
                                        className="col-span-2 aspect-video h-24 object-cover"
                                    />
                                    <p className="col-span-2">
                                        {item.channel.name}
                                    </p>
                                    <p className="col-span-2">
                                        {item.channel.title}
                                    </p>
                                    <p className="col-span-2">
                                        {dateTimeFormat(item.createdAt)}
                                    </p>
                                    <div className="col-span-1">
                                        <Link to={`/channel/${item.channelID}`}>
                                            <ArrowRightSVG className="h-6 hover:text-orange-500" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default AdminUserByIdPage
