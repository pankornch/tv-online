import React, { ChangeEvent, FormEvent } from "react"
import { ReactComponent as LogoSVG } from "@/assets/logo.svg"
import axios from "@/configs/axios"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import useUser from "@/hooks/useUser"

function LoginPage() {
    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const { reAuth } = useUser()

    const navigate = useNavigate()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const body = {
            username,
            password,
        }
        try {
            const res = await axios.post("/admin/login", body)
            localStorage.setItem("accessToken", res.data.accessToken)
            reAuth()
            await Swal.fire({
                title: "Login Success",
                icon: "success",
                timer: 3000,
            })
            navigate("/backoffice")
        } catch (error: any) {
            const message = error.response.data?.message || error.message
            Swal.fire({ title: "Login Error", icon: "error", text: message })
        }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target

        switch (name) {
            case "username":
                setUsername(value)
                break
            case "password":
                setPassword(value)
                break
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-800">
            <div className="w-full max-w-xl space-y-12 rounded-md bg-white p-12 text-black shadow-lg">
                <div className="flex items-center justify-center gap-x-3">
                    <LogoSVG className="h-12 w-12" />
                    <h2>TV ONLINE</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
                    <input
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Username"
                        autoComplete="username"
                    />
                    <input
                        name="password"
                        value={password}
                        onChange={handleInputChange}
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
