import React from "react"

function useUserID(): [string, () => void] {
    const [uid, setUid] = React.useState<string>("")

    function genID() {
        return Date.now().toString(16)
    }

    function handleSetUid() {
        const newUid = genID()
        setUid(newUid)
        localStorage.setItem("uid", newUid)
    }

    React.useEffect(() => {
        const localUid = localStorage.getItem("uid")

        if (localUid) {
            setUid(localUid)
            return
        }
        handleSetUid()
    }, [])

    return [uid, handleSetUid]
}

export default useUserID
