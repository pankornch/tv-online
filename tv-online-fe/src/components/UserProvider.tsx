import React, { createContext, ReactNode, useEffect, useState } from "react"
import jwtDecode, { JwtPayload } from "jwt-decode"
import { IUser } from "@/types"
import axios from "@/configs/axios"

export type UserStatus = "AUTHENTICATED" | "UNAUTHENTICATED" | null

function defaultError() {
    throw new Error("UserContext should inside UserProvider")
}

export interface UserContextProps {
    user: IUser | undefined | null
    status: UserStatus
    reAuth: () => void
    logout: () => void
    login: (username: string, password: string) => Promise<string | undefined>
}

const defaultContextValue: UserContextProps = {
    user: null,
    status: null,
    reAuth() {
        defaultError()
    },
    logout() {
        defaultError()
    },
    async login() {
        defaultError()
        return undefined
    },
}

export const UserContext = createContext<UserContextProps>(defaultContextValue)

interface Props {
    children: ReactNode
}

function UserProvider(props: Props) {
    const [user, setUser] = useState<any | null>(null)
    const [status, setStatus] = useState<UserStatus>(null)

    function getUser(): void {
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

    function logout(): void {
        localStorage.removeItem("accessToken")
        setStatus("UNAUTHENTICATED")
    }

    async function login(
        username: string,
        password: string
    ): Promise<string | undefined> {
        try {
            const res = await axios.post("/admin/login", { username, password })
            localStorage.setItem("accessToken", res.data.accessToken)
            getUser()
            return "success"
        } catch (error: any) {
            throw new Error(error.response.data?.message || error.messagee)
        }
    }

    useEffect(() => {
        if (!user) getUser()
    }, [])

    return (
        <UserContext.Provider
            value={{ user, status, reAuth: getUser, logout, login }}
        >
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider
