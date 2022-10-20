import React, { ReactNode, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface IMenuItem {
    key: string
    children: ReactNode
}

interface Props {
    menus: IMenuItem[]
    value: string
}

function ToggleMenu({ menus, value }: Props) {
    const variant = {
        animate: { x: 0, opacity: 1 },
        exit: { opacity: 0 },
    }

    const renderMenu = useMemo(() => {
        const menu = menus.find((menu) => menu.key === value)
        return menu?.children ?? null
    }, [menus, value])

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={value}
                variants={variant}
                transition={{ duration: 0.2 }}
                initial="exit"
                animate="animate"
                exit="exit"
            >
                {renderMenu}
            </motion.div>
        </AnimatePresence>
    )
}

export default ToggleMenu
