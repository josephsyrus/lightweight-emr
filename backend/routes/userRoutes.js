import express from "express";
import { addStaff } from "../controllers/userController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import { auditLogger } from "../middleware/auditLogger.js";

const router = express.Router();

router.use(verifyToken);
router.use(auditLogger);

router.post("/", checkRole(["Admin"]), addStaff);

export default router;
