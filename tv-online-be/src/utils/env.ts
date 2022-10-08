import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string) {
  return process.env[name];
}

export const JWT_ACCESS_TOKEN_SECRET = getEnv("JWT_ACCESS_TOKEN_SECRET");
export const PG_URI = getEnv("PG_URI");
