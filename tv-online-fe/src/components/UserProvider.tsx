import React from "react"
import jwtDecode, { JwtPayload } from "jwt-decode"

export type UserStatus = "AUTHENTICATED" | "UNAUTHENTICATED" | null

export const UserContext = React.createContext<{
    user: any
    status: UserStatus
    reAuth: () => void
    logout: () => void
}>({ user: null, status: null, reAuth() {}, logout() {} })

interface Props {
    children: React.ReactNode
}

function UserProvider(props: Props) {
    const [user, setUser] = React.useState<any | null>(null)
    const [status, setStatus] = React.useState<UserStatus>(null)

    function getUser() {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            setStatus("UNAUTHENTICATED")
            return
        }

        const decoded = jwtDecode<JwtPayload>(accessToken)

        const isExpired = (decoded.exp || 0) * 1000 < Date.now()

        if (isExpired) {
            setStatus("UNAUTHENTICATED")
            return
        }

        setUser(decoded)
        setStatus("AUTHENTICATED")
    }

    function logout() {
        localStorage.removeItem("accessToken")
        getUser()
    }

    React.useEffect(() => {
        if (!user) getUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, status, reAuth: getUser, logout }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider
