import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, defaultValue?: string | number | boolean) {
  return process.env[name] ?? defaultValue;
}

export const JWT_ACCESS_TOKEN_SECRET = getEnv(
  "JWT_ACCESS_TOKEN_SECRET"
) as string;
export const PG_URI = getEnv("PG_URI") as string;
export const PORT = getEnv("PORT", 5500);
export const HOST_NAME = getEnv("HOST_NAME", "http://localhost:5500");
