import jwt from "jsonwebtoken";
import { IAccessTokenPayload } from "../types";
import { JWT_ACCESS_TOKEN_SECRET } from "../utils/env";

const accessTokenExpired = "15d";

export function createAccessToken(payload: Record<string, any>) {
  if (!JWT_ACCESS_TOKEN_SECRET) {
    throw new Error("requried env JWT_ACCESS_TOKEN_SECRET");
  }

  return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: accessTokenExpired,
  });
}

export function verifyAccessToken(token: string): IAccessTokenPayload {
  if (!JWT_ACCESS_TOKEN_SECRET) {
    throw new Error("requried env JWT_ACCESS_TOKEN_SECRET");
  }

  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as IAccessTokenPayload;
}
