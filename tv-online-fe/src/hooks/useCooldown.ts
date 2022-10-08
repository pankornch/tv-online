import React from "react"

function useCooldown(
    onCooldownEnd?: () => void
): [number, (value: number, ms: number) => void] {
    const [count, setCount] = React.useState<number>(0)

    const timerRef = React.useRef<NodeJS.Timer>()

    function setNewCount(value: number, ms: number = 10) {
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
