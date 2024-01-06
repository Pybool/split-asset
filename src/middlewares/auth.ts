import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Xrequest from "../interfaces/extensions.interface";
import User from "../models/user.model";
import IUserProfile from "../interfaces/user.interface";

export const Auth = async (
  req: Xrequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await BaseAuth(req, res, next);

    if (!user.status) {
      throw new Error("Email is not verified");
    }

    if (!user?.status) {
      throw new Error("Email is not verified");
    }

    if (!user.isEmailVerified) {
      throw new Error("Email is not verified");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "You are not authenticated" });
  }
};

export const BaseAuth = async (
  req: Xrequest,
  res: Response,
  next: NextFunction
): Promise<IUserProfile> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error("Token not found");
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
  const user: IUserProfile | null = await User.prototype.getUserProfileById(decoded.aud );
  if (!user) {
    throw new Error("User profile not found");
  }

  if (!user.status) {
    throw new Error("Account restricted");
  }
  
  return user;
};

//admin
export const AdminAuth = async (
  req: Xrequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await BaseAuth(req, res, next);

    if (!user.isAdmin) {
      throw new Error("You are not authorized to perform this action");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: error });
  }
};
