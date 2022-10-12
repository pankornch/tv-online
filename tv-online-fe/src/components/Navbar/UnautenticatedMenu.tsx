import { Link } from "react-router-dom"

function UnauthenicatedMenu() {
    return (
        <Link to="/login">
            <span className="underline-offset-4 hover:underline">Login</span>
        </Link>
    )
}

export default UnauthenicatedMenu
