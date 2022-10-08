import Axios from "axios"

const axios = Axios.create({
    baseURL: "http://localhost:5500/api/v1",
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
