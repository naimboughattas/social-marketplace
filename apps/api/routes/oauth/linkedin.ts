import { Router } from "express";
import * as Linkedin from "../../controllers/oauth/linkedin";

const router: Router = Router();

router.get("/cb/linkedin", Linkedin.OAuthCallback);
router.get("/linkedin/auth", Linkedin.generateAuthURL);

export default router;
