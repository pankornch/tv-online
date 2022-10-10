import axios from "@/configs/axios"
import React from "react"

export function cloneObj<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}

export async function handleUploadImage(file: File, fieldname = "image") {
    const formData = new FormData()
    formData.append(fieldname, file)

    const res = await axios.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })

    return res.data
}

export function getAvatarUrl(seed: string) {
    return `https://avatars.dicebear.com/api/big-smile/${seed}.svg`
}

export function debounce(func: any, timeout = 300) {
    let timer: NodeJS.Timer
    return (...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(...args)
        }, timeout)
    }
}

export function cls(...classess: any[]) {
    return classess.filter(Boolean).join(" ")
}

export function getDate(date: string | Date) {
    const _date = new Date(date)
    if (isNaN(_date.getTime())) return null
    return _date.toISOString().split("T")[0]
}

export function compactNumber(num: number) {
    return new Intl.NumberFormat("en", { notation: "compact" }).format(num)
}

export function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function dateTimeFormat(
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
) {
    return new Intl.DateTimeFormat(
        "en",
        options || {
            timeStyle: "short",
            dateStyle: "long",
            timeZone: getTimeZone(),
        }
    ).format(new Date(date))
}

export function setStateInput(setState: React.SetStateAction<any>) {
    return (e: React.ChangeEvent<any>) => {
        const { value } = e.target
        setState(value)
    }
}

export function setStateInputObj(setState: React.SetStateAction<any>) {
    return (e: React.ChangeEvent<any>) => {
        const { value, name } = e.target
        setState((prev: any) => {
            prev[name] = value
            return { ...prev }
        })
    }
}
