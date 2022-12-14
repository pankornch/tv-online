import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import ReactDOM from "react-dom"

interface Props {
    open?: boolean
    onClose?: (status: boolean) => void
    children?: React.ReactNode
}

function Modal(props: Props) {
    function handleClose() {
        props.onClose?.call(null, false)
    }

    React.useEffect(() => {
        document.body.style.overflow = props.open ? "hidden" : "unset"
    }, [props.open])

    return ReactDOM.createPortal(
        <>
            <AnimatePresence>
                {props.open && (
                    <div className="fixed inset-0 isolate z-50 h-full w-full">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.25 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="absolute inset-0 -z-10 h-full w-full bg-black"
                            onClick={handleClose}
                        />
                        <motion.div
                            initial={{ y: "100vh" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100vh" }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="z-10"
                        >
                            {props.children}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>,
        document.getElementById("modal-portal")!
    )
}

export * from "./Channel"

export default Modal
