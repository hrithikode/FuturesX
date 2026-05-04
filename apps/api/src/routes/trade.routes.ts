import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createOrder } from "../controllers/trade.controller.js";

const router: Router = Router();

router.post('/open', authenticate, createOrder);


export default router;