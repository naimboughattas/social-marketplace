import { Router } from "express";
import * as Youtube from "../../controllers/oauth/youtube";

const router: Router = Router();

router.get("/cb/youtube", Youtube.OAuthCallback);
router.get("/youtube/auth", Youtube.generateAuthURL);

export default router;
