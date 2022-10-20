import { IUser } from "@/types"
import jwtDecode, { JwtPayload } from "jwt-decode"
import React, { useState } from "react"

type ReturnUserID = [string, () => void]
type JwtPayloadUser = JwtPayload & IUser

function useUserID(): ReturnUserID {
    const [uid, setUid] = useState<string>("")

    function genID(): string {
        return Date.now().toString(16)
    }

    function handleSetUid() {
        const newUid = genID()
        setUid(newUid)
        localStorage.setItem("uid", newUid)
    }

    function getUser(): JwtPayloadUser | null {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            return null
        }

        const decoded = jwtDecode<JwtPayloadUser>(accessToken)

        const isExpired = (decoded.exp || 0) * 1000 < Date.now()

        if (isExpired) {
            return null
        }

        return decoded
    }

    React.useEffect(() => {
        const user = getUser()

        if (!user) {
            const localUid = localStorage.getItem("uid")

            if (localUid) {
                setUid(localUid)
                return
            }
            handleSetUid()
        } else {
            setUid(user.username)
        }
    }, [])

    return [uid, handleSetUid]
}

export default useUserID
