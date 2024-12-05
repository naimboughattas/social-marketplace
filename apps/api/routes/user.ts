import { Router } from "express";
import * as User from "../controllers/user";

const router: Router = Router();

router.get("/user/:userId/accounts", async (req, res) => {
  const user = await User.getAccounts(req.params.userId);
  res.send(user);
});

export default router;
