import React from "react"

interface Props {
    urls: string[]
    max?: number
}

function AvatarGroup(props: Props) {
    const rest = React.useMemo(() => {
        if (props.max === undefined || props.max >= props.urls.length) return 0
        return props.urls.length - props.max
    }, [props.urls, props.max])

    return (
        <div className="flex justify-end">
            {props.urls
                .slice(0, props.max ?? props.urls.length)
                .map((url, index) => (
                    <div key={index}>
                        <img
                            src={url}
                            alt=""
                            className="h-8 w-8 rounded-full"
                        />
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
