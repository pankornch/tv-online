import { io, SocketOptions, ManagerOptions } from "socket.io-client"

function socket() {
    const option: Partial<ManagerOptions & SocketOptions> = {}

    const accessToken = localStorage.getItem("accessToken")

    if (accessToken) {
        option.auth = {
            authorization: `Bearer ${accessToken}`,
        }
    }

    const connect = io("ws://localhost:5500", option)

    return connect
}

export default socket
