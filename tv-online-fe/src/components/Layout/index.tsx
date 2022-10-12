import Navbar from "../Navbar"

interface Props {
    className?: string
    children: React.ReactNode
    navbar?: boolean
}

function Layout(props: Props) {
    return (
        <main className="min-h-screen bg-neutral-800">
            {(props.navbar ?? true) && <Navbar />}

            <div className={props.className || "container"}>
                {props.children}
            </div>
        </main>
    )
}

export default Layout
