import React from "react"
import { ReactComponent as PhotoSVG } from "@/assets/photo.svg"

interface Props {
    value?: string | File
    onChange?: (url: string, file: File) => void
}

function ImageUploader(props: Props) {
    // const [file, setFile] = React.useState<File | null>(null)

    const previewImage = React.useMemo<string>(() => {
        if (!props.value) return ""

        if (typeof props.value === "string") return props.value

        const url = URL.createObjectURL(props.value)
        return url
    }, [props.value])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { files } = e.target

        if (!files?.length) return

        const file = files[0]
        const url = URL.createObjectURL(file)
        props?.onChange?.call(null, url, file)
    }

    return (
        <div className="relative isolate h-64 w-full overflow-hidden rounded-lg border">
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />

            {previewImage ? (
                <img
                    src={previewImage}
                    className="h-full w-full object-cover"
                />
            ) : (
                <ImagePlaceholder />
            )}
        </div>
    )
}

function ImagePlaceholder() {
    return (
        <div className="flex h-full w-full items-center justify-center border bg-gray-100">
            <PhotoSVG className="h-32 w-32 text-gray-300" />
        </div>
    )
}

export default ImageUploader
