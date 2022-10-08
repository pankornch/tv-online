import useUser from "@/hooks/useUser"
import { Navigate, Outlet } from "react-router-dom"
interface Props {
    children: React.ReactNode
}
function ProtectRoute(props: Props) {
    const { status } = useUser()

    if (status === "UNAUTHENTICATED") {
        return <Navigate to="/login" replace />
    }
    return <>{props.children || <Outlet />}</>
}

export default ProtectRoute
