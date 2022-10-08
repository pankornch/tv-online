import useCooldown from "@/hooks/useCooldown"
import React, { useEffect, useImperativeHandle, useMemo } from "react"
import Arc from "./Arc"

interface Props {
    radius: number
    color?: string
    ms: number
    startOnMount?: boolean
    onCooldownEnd?: () => void
}

export type ProgressArcRef = {
    startCount: (ms: number) => void
}

function ProgressArc(
    { radius, color, ms, onCooldownEnd, startOnMount }: Props,
    forwardRef: React.Ref<ProgressArcRef>
) {
    const [count, setCount] = useCooldown(onCooldownEnd)

    useImperativeHandle(forwardRef, () => ({
        startCount: handleCount,
    }))

    const divider = 50

    function handleCount(ms: number) {
        setCount(ms / divider, divider)
    }
    const percent = useMemo(() => {
        return count / (ms / divider)
    }, [count])

    useEffect(() => {
        if (startOnMount) handleCount(ms)
    }, [startOnMount])

    return <Arc deg={360 - 360 * percent} radius={radius} color={color} />
}

export default React.forwardRef(ProgressArc)
