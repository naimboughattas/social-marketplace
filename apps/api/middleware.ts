import { NextFunction, Request, Response } from "express";
import { getCachedData } from "./lib/redis";

// Middleware to check if data is in the cache
export const checkCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cachedData = await getCachedData(req.params.id);
  console.log("Cached Data");

  if (cachedData && cachedData.expiresAt > Date.now()) {
    res.send(cachedData.data);
  } else {
    console.log("Refreshing cache");
    next(); // Continue to the route handler if data is not in the cache
  }
};
