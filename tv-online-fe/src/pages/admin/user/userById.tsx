import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import Layout from "@/components/Layout"
import axios from "@/configs/axios"
import { IChannelLog } from "@/types"
import { dateTimeFormat, getAvatarUrl } from "@/utils"

import { ReactComponent as ArrowRightSVG } from "@/assets/arrow-right.svg"

function AdminUserByIdPage() {
    const { id } = useParams()

    const [userLogs, setUserLogs] = useState<IChannelLog[]>([])

    async function fetchUserLogs(id: string) {
        const res = await axios.get(`/admin/channel/log/user/${id}`)
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

                        <div className="max-h-[calc(100vh-5rem-8rem)] min-h-[24rem] overflow-auto rounded-lg bg-white">
                            <table className="w-full table-auto text-center">
                                <thead className="sticky top-0 bg-white shadow-md">
                                    <tr className="">
                                        <th className="px-6 py-4">No.</th>
                                        <th className="px-6 py-4">Cover</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userLogs.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="transition-all hover:bg-gray-100"
                                        >
                                            <td className="px-6 py-4">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={item.channel?.image}
                                                    className="mx-auto aspect-video w-32 object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.channel?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.channel?.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                {dateTimeFormat(item.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/channel/${item.channelID}`}
                                                >
                                                    <ArrowRightSVG className="h-6 hover:text-orange-500" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default AdminUserByIdPage
