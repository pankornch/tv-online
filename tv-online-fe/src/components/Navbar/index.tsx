import React from "react"
import { Link } from "react-router-dom"
import { ReactComponent as LogoSVG } from "@/assets/logo.svg"
import useUser from "@/hooks/useUser"

import AuthenticatedMenu from "./AuthenticatedMenu"
import UnauthenicatedMenu from "./UnautenticatedMenu"

function Navbar() {
    const { status } = useUser()

    return (
        <header className="sticky top-0 z-50 mb-6 border-b border-neutral-600 bg-neutral-800 ">
            <nav className="container flex items-center justify-between py-4">
                <Link to="/">
                    <div className="flex cursor-pointer items-center gap-3 text-white">
                        <LogoSVG className="h-12 w-12" />
                        <h3 className="hidden sm:block">TV ONLINE</h3>
                    </div>
                </Link>

                <div className="text-white">
                    {status === "AUTHENTICATED" ? (
                        <AuthenticatedMenu />
                    ) : (
                        <UnauthenicatedMenu />
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
