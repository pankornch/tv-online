import React from "react"
import { UserContext, UserContextProps } from "@/components/UserProvider"

function useUser(): UserContextProps {
    const context = React.useContext(UserContext)
    return context
}

export default useUser
