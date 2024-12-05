import { Router } from "express";
import * as Tiktok from "../../controllers/oauth/tiktok";

const router: Router = Router();

router.get("/cb/tiktok", Tiktok.OAuthCallback);
router.get("/tiktok/auth", Tiktok.generateAuthURL);

export default router;
