import React from "react"
import socket from "@/configs/socket"

function useSocket() {
    const [socketio, setSocketio] = React.useState<ReturnType<typeof socket>>()

    React.useEffect(() => {
        const _socket = socket()

        _socket.on("connect", () => {
            console.log("socket connected", _socket.id)
            setSocketio(_socket)
        })

        return () => {
            _socket.off("connect")
            _socket.disconnect()
            console.log("socket disconnect")
        }
    }, [])

    return socketio
}

export default useSocket
