import {Router} from "express";
import { getCategoryBreakdown, getRecentRecords, getSummary } from "./dashboard.controller.js";
import {authMiddleware} from "../../middleware/auth.middleware.js"
const router = Router();

router.get("/summary",authMiddleware,getSummary);
router.get("/category",authMiddleware,getCategoryBreakdown);
router.get("/recent",authMiddleware,getRecentRecords);

export default router;