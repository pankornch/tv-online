import React, { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import useUser from "@/hooks/useUser"
import { setStateInput } from "@/utils"
import { ReactComponent as LogoSVG } from "@/assets/logo.svg"

function LoginPage() {
    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const { login } = useUser()

    const navigate = useNavigate()

    async function handleSubmit(
        username: string,
        password: string,
        e: FormEvent
    ) {
        e.preventDefault()

        try {
            await login(username, password)
            await Swal.fire({
                title: "Login Success",
                icon: "success",
                timer: 3000,
            })
            navigate("/backoffice")
        } catch (error: any) {
            Swal.fire({
                title: "Login Error",
                icon: "error",
                text: error.message,
            })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-800">
            <div className="w-full max-w-xl space-y-12 rounded-md bg-white p-12 text-black shadow-lg">
                <div className="flex items-center justify-center gap-x-3">
                    <LogoSVG className="h-12 w-12" />
                    <h2>TV ONLINE</h2>
                </div>
                <form
                    onSubmit={handleSubmit.bind(null, username, password)}
                    className="flex flex-col gap-y-6"
                >
                    <input
                        name="username"
                        value={username}
                        onChange={setStateInput(setUsername)}
                        className="input"
                        placeholder="Username"
                        autoComplete="username"
                    />
                    <input
                        name="password"
                        value={password}
                        onChange={setStateInput(setPassword)}
                        type="password"
                        className="input"
                        placeholder="Password"
                        autoComplete="current-password"
                    />
                    <button
                        className="button mt-6 bg-orange-500 text-white"
                        type="submit"
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
