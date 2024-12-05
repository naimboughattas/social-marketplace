import { Router } from "express";
import * as Instagram from "../../controllers/oauth/instagram";

const router: Router = Router();

router.get("/cb/instagram", Instagram.OAuthCallback);
router.get("/instagram/auth", Instagram.generateAuthURL);

export default router;
