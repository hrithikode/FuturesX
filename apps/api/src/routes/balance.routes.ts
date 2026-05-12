import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getBalance } from "../controllers/balance.controller.js";


const router: Router = Router();

router.get("/", authenticate, getBalance);

export default router;