import React from "react"

interface Props {
    urls: string[]
    max?: number
}

function AvatarGroup(props: Props) {
    const rest = React.useMemo(() => {
        if (props.max === undefined) return 0
        return Math.max(0, props.max - 1 - props.urls.length)
    }, [props.urls, props.max])

    const avatarList = React.useMemo(() => {
        return props.urls.slice(0, props.max ?? props.urls.length)
    }, [props.urls, props.max])

    return (
        <div className="flex justify-end">
            {avatarList.map((url, index) => (
                <div key={index}>
                    <img src={url} alt="" className="h-8 w-8 rounded-full" />
                </div>
            ))}

            {rest > 0 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-xs text-white">
                    + {rest}
                </div>
            )}
        </div>
    )
}

export default AvatarGroup
