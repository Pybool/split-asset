import { rateLimit } from "express-rate-limit";

export const oneMinlimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 2, // limit each IP to 2 requests 
  message: "Too many requests from this IP, please try again later.",
});

export const twoMinlimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 2, // limit each IP to 2 requests 
  message: "Too many requests from this IP, please try again later.",
});
