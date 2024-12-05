import { Router } from "express";
import * as X from "../../controllers/oauth/x";

const router: Router = Router();

router.get("/cb/x", X.OAuthCallback);
router.get("/x/auth", X.generateAuthURL);

export default router;
