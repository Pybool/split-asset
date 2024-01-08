import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Xrequest from "../interfaces/extensions.interface";
import config from "../settings";
import User from "../models/user.model";
import { config as dotenvConfig } from 'dotenv';
dotenvConfig()

const SECRET_KEY: string = process.env.ACCESS_TOKEN_SECRET || "";
console.log("XXXXX", SECRET_KEY)
export const decode = (req: Xrequest, res: Response, next: any) => {
  const reqHeaders: any = req.headers;
  if (config.ensureAuth) {
    if (!reqHeaders["authorization"]) {
      return res
        .status(400)
        .json({ success: false, message: "No access token provided" });
    }
  } else {
    return next();
  }

  const accessToken = reqHeaders.authorization.split(" ")[1];
  try {
    const decoded: any = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.aud;
    req.user = User.findOne({ _id: req.userId });
    return next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export async function ensureAdmin(req: Xrequest, res: Response, next: NextFunction) {
  try {
    const reqHeaders: any = req.headers;
    const accessToken = reqHeaders.authorization.split(" ")[1];
    const decoded: any = jwt.verify(accessToken, SECRET_KEY);
    
    req.userId = decoded.aud;
    req.user = await User.findById(req.userId);
    console.log("decode ", req.userId)
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: User is not an admin" });
    }
  } catch (error: any) {
    console.log("Error", error)
    res.status(403).json({ message: "Forbidden: User is not an admin" });
  }
}
