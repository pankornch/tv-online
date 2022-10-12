// https://vitejs.dev/guide/env-and-mode.html#env-files
function getEnv(name: string, defaultValue?: string | number | boolean) {
    return import.meta.env[name] ?? defaultValue
}

export const BASE_API_URL: string = getEnv("VITE_API_BASE_URL")
export const WS_URL: string = getEnv("VITE_API_WS_URL")
