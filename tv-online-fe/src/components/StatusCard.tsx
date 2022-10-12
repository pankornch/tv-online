interface StatusCardProps {
    children: React.ReactNode
}

function StatusCard(props: StatusCardProps) {
    return (
        <div className="flex items-center gap-x-6 rounded-lg bg-neutral-700 p-4">
            {props.children}
        </div>
    )
}

export default StatusCard
