import React from "react"

interface Props {
    children: React.ReactNode
    onClickOutside?: () => void
    className?: string
}

function ClickOutside(props: Props) {
    const ref = React.useRef<HTMLDivElement | null>(null)

    const handleClickOutside = React.useCallback((event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            props.onClickOutside?.call(null)
        }
    }, [])

    React.useEffect(() => {
        if (!ref.current) return

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className={props.className} ref={ref}>
            {props.children}
        </div>
    )
}

export default ClickOutside
