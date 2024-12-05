import { NextFunction, Request, Response, Router } from "express";
import * as Account from "../controllers/account";
import { getCachedData, setCachedData } from "../lib/redis";

// Middleware to check if data is in the cache
const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  const cachedData = await getCachedData(req.params.accountId);
  console.log("Cached Data");

  if (cachedData && cachedData.expiresAt > Date.now()) {
    res.send(cachedData.account);
  } else {
    console.log("Refreshing cache");
    next(); // Continue to the route handler if data is not in the cache
  }
};

const router: Router = Router();

router.post("/api/influencers", async (req, res) => {
  try {
    const filters = req.body;

  

    res.json(influencers);
  } catch (error) {
    console.error("Error fetching influencers:", error);
    res.status(500).json({ error: "Failed to fetch influencers" });
  }
});

router.get("/account/:accountId", checkCache, async (req, res) => {
  const account = await Account.getAccountById(req.params.accountId);
  res.send(account);
});

router.post("/account/update", async (req, res) => {
  console.log("Updating account:", req.body.accountId, req.body.updates);
  await Account.updateAccount(req.body.accountId, req.body.updates);
  const account = await Account.getAccountById(req.body.accountId);
  await setCachedData(req.body.accountId, {
    account,
    expiresAt: Date.now() + 3600 * 1000, // 1 hour
  });
  res.send(account);
});

export default router;
