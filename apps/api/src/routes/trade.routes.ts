import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { closeOrder, createOrder, getOrders } from "../controllers/trade.controller.js";

const router: Router = Router();

router.post('/create', authenticate, createOrder);
router.post("/close/:orderId", authenticate, closeOrder);
router.get("/orders",authenticate, getOrders);

export default router;