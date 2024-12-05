import { Router } from "express";
import * as Facebook from "../../controllers/oauth/facebook";

const router: Router = Router();

router.get("/cb/facebook", Facebook.OAuthCallback);
router.get("/facebook/auth", Facebook.generateAuthURL);

export default router;
