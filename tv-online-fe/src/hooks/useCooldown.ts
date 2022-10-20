import React, { useState } from "react"

type ReturnUserCooldown = [number, (value: number, ms: number) => void]

function useCooldown(onCooldownEnd?: () => void): ReturnUserCooldown {
    const [count, setCount] = useState<number>(0)

    function setNewCount(value: number, ms: number = 10): void {
        setCount(value)
        countDown(value, ms)
    }

    const countDown = React.useCallback(async (value: number, ms: number) => {
        for (let c = value; c >= 0; c--) {
            await sleep(ms)
            setCount(c)
        }
        onCooldownEnd?.call(null)
    }, [])

    return [count, setNewCount]
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export default useCooldown
