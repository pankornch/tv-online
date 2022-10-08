import React from "react"
import { UserContext } from "@/components/UserProvider"

function useUser() {
    const context = React.useContext(UserContext)
    return context
}

export default useUser
