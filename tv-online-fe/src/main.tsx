import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import router from "./pages/router"
import { RouterProvider } from "react-router-dom"
import UserProvider from "./components/UserProvider"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </React.StrictMode>
)
