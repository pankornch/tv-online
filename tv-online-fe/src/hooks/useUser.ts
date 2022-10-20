import React, { useContext } from "react"
import { UserContext, UserContextProps } from "@/components/UserProvider"

function useUser(): UserContextProps {
    const context = useContext(UserContext)
    return context
}

export default useUser
