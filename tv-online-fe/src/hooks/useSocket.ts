import React from "react"
import connect from "@/configs/socket"
import { Socket } from "socket.io-client"

type SocketCb = (socket: Socket) => CleanUpFn | void
type CleanUpFn = () => any

function useSocket(cb?: SocketCb): Socket | undefined {
    const [socket, setSocket] = React.useState<Socket>()

    React.useEffect(() => {
        const _socket = connect()

        let cleanUpFn: CleanUpFn | undefined | void

        _socket.on("connect", () => {
            console.log("socket connected", _socket.id)
            setSocket(_socket)
            cleanUpFn = cb?.call(null, _socket)
        })

        return () => {
            _socket.off("connect")
            _socket.disconnect()
            console.log("socket disconnect")
            cleanUpFn?.call(null)
        }
    }, [])

    return socket
}

export default useSocket
