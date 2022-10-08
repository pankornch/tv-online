import React from "react"
import { Link, useNavigate, NavLink } from "react-router-dom"
import { ReactComponent as LogoSVG } from "@/assets/logo.svg"
import useUser from "@/hooks/useUser"
import { ReactComponent as UserCircleSVG } from "@/assets/user-circle.svg"
import { cls } from "@/utils"
import ClickOutside from "./ClickOutside"

function Navbar() {
    const { user, status, logout } = useUser()

    const [showMenu, setShowMenu] = React.useState<boolean>(false)

    const navigate = useNavigate()

    function handleCloseMenu() {
        setShowMenu(false)
    }

    function handleToggleMenu() {
        setShowMenu(!showMenu)
    }

    function handleLogout() {
        logout()
        navigate("/")
    }

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
                        <div className="flex items-center gap-x-3">
                            <NavLink
                                to="/backoffice"
                                className={({ isActive }) =>
                                    cls(
                                        "underline-offset-4 hover:font-medium",
                                        isActive && "text-orange-500 underline"
                                    )
                                }
                            >
                                Backoffice
                            </NavLink>
                            <div className="relative">
                                <button
                                    className="flex items-center gap-x-1"
                                    onClick={handleToggleMenu}
                                >
                                    <UserCircleSVG />
                                    <p>{user.username}</p>
                                </button>
                                {showMenu && (
                                    <ClickOutside
                                        onClickOutside={handleCloseMenu}
                                    >
                                        <div className="absolute -bottom-[2.5rem] right-0 w-24 overflow-hidden rounded-sm bg-neutral-400 shadow-lg">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-2 py-1 hover:bg-neutral-300"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </ClickOutside>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link to="/login">
                            <span className="underline-offset-4 hover:underline">
                                Login
                            </span>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
