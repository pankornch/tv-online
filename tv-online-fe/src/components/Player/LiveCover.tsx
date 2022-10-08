import { ReactComponent as EyeSVG } from "@/assets/eye.svg"
import { compactNumber } from "@/utils"

interface Props {
    userCount: number
}

export function LiveCover(props: Props) {
    return (
        <div className="absolute bottom-3 left-3 flex items-center gap-x-3 text-white">
            <div className="relative bg-red-500 px-2 py-1">
                <div className="absolute -top-1 -right-1 h-3 w-3">
                    <div className="absolute h-full w-full animate-ping rounded-full bg-red-300" />
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                </div>
                <p className="text-xs">LIVE</p>
            </div>
            <div className="flex items-center gap-x-2 bg-black/50 px-2 py-1">
                <EyeSVG className="h-4" />
                <p className="text-xs">{compactNumber(props.userCount)}</p>
            </div>
        </div>
    )
}

export default LiveCover
