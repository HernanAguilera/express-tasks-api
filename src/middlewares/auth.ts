import { Request, Response, NextFunction } from "express";
import { AuthJWT } from "../utils/auth";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      throw new Error("Authorization header is missing");
    }

    const authJWT = new AuthJWT();
    const userId = authJWT.getUserIdFromToken(token.split(" ")[1]);

    if (!userId) {
      throw new Error("User not found");
    }

    req.body.userId = userId;
    next();
  } catch (error: any) {
    switch (error?.message as string) {
      case "Authorization header is missing":
        res.status(401).json({ error: "Authorization header is missing" });
        break;
      case "User not found":
        res.status(401).json({ error: "User not found" });
        break;
      default:
        res.status(500).json({ error: "Internal server error" });
        break;
    }
  }
};
