import { createBrowserRouter, Outlet } from "react-router-dom"
import App from "../App"
import ProtectRoute from "../components/ProtectRoute"
import BackofficeIndexPage from "./admin"
import AdminChannelByIdPage from "./admin/channel/ChannelById"
import AdminUserByIdPage from "./admin/user/userById"
import ChannelByIdPage from "./channel/ChannelById"
import LoginPage from "./login"

const router = createBrowserRouter([
    { path: "/", index: true, element: <App /> },
    {
        path: "/channel",
        children: [
            {
                path: ":id",
                element: <ChannelByIdPage />,
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/backoffice",
        element: (
            <ProtectRoute>
                <Outlet />
            </ProtectRoute>
        ),
        children: [
            {
                path: "",
                element: <BackofficeIndexPage />,
            },
            {
                path: "channel/:id",
                element: <AdminChannelByIdPage />,
            },
            {
                path: "user",
                children: [
                    {
                        path: ":id",
                        element: <AdminUserByIdPage />,
                    },
                ],
            },
        ],
    },
])

export default router
