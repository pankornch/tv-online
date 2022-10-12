import useUser from "@/hooks/useUser"
import { cls } from "@/utils"
import React from "react"
import { useNavigate, NavLink } from "react-router-dom"
import ClickOutside from "../ClickOutside"
import { ReactComponent as UserCircleSVG } from "@/assets/user-circle.svg"

function AuthenticatedMenu() {
    const navigate = useNavigate()

    const { user, logout } = useUser()

    const [showMenu, setShowMenu] = React.useState<boolean>(false)

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
                    <p>{user?.username}</p>
                </button>
                {showMenu && (
                    <ClickOutside
                        onClickOutside={handleCloseMenu}
                        className="absolute -bottom-[2.5rem] right-0 w-24 overflow-hidden rounded-sm shadow-lg"
                    >
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 px-2 py-1 hover:bg-red-400"
                        >
                            Log out
                        </button>
                    </ClickOutside>
                )}
            </div>
        </div>
    )
}

export default AuthenticatedMenu
