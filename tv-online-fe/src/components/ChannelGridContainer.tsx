interface Props {
    children: React.ReactNode
}
function ChannelGridContainer({ children }: Props) {
    return (
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 xl:grid-cols-3">
            {children}
        </div>
    )
}

export default ChannelGridContainer
