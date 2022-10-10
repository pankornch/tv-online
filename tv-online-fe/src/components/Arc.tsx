import React from "react"

interface Props {
    deg: number
    radius: number
    color?: string
}
function Arc({ deg, radius, color }: Props) {
    const arcRef = React.useRef<SVGPathElement | null>(null)

    function setArc(deg: number) {
        const _radius = radius / 2
        const d = describeArc(_radius, _radius, _radius, 0, deg % 360)
        arcRef.current?.setAttribute("d", d)
    }

    React.useEffect(() => {
        setArc(deg)
    }, [deg])

    return (
        <svg width={radius} height={radius}>
            <path ref={arcRef} fill={color} />
        </svg>
    )
}

// https://stackoverflow.com/a/24569190

function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    }
}

function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
) {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)

    const arcSweep = endAngle - startAngle <= 180 ? "0" : "1"

    const d = [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        arcSweep,
        0,
        end.x,
        end.y,
        "L",
        x,
        y,
        "L",
        start.x,
        start.y,
    ].join(" ")

    return d
}
export default Arc
