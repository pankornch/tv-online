import { BASE_API_URL } from "@/utils/env"
import Axios from "axios"

const axios = Axios.create({
    baseURL: BASE_API_URL,
})

axios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken")

    if (accessToken) {
        if (!config.headers) config.headers = {}
        config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
})

export default axios
