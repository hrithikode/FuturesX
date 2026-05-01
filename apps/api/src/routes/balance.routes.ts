import { Router } from "express";
import { depositBalance, getBalance, getBalanceByAsset } from "../controllers/balance.controller.js";


const router: Router = Router();

router.get("/", getBalance);
router.get("/:symbol", getBalanceByAsset);
router.post("/deposit", depositBalance);

export default router;