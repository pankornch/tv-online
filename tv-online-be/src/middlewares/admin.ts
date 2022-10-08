import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";
import { EUserRole } from "../types";

export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const accessToken = req.headers?.authorization;

  if (!accessToken) {
    res.sendStatus(401);
    return;
  }

  const [_Bearer, token] = accessToken.split(" ");

  try {
    const decoded = verifyAccessToken(token);

    if (decoded.role !== EUserRole.ADMIN) {
      res.status(403).send("Access denied");
      return;
    }
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      res.status(403).json({ error: "token expired" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
