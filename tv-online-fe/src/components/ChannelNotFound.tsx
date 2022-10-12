import { Link } from "react-router-dom"

interface Props {
    channelID?: string
}

function ChannelNotFound({ channelID }: Props) {
    return (
        <div className="space-y-3 text-white">
            <h2>Channel Not Found!</h2>
            <p>/channel/{channelID}</p>
            <h4 className="underline">
                <Link to="/">Back to home page.</Link>
            </h4>
        </div>
    )
}

export default ChannelNotFound
