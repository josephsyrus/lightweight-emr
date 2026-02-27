import express from "express";
import { getClinicAuditLogs } from "../controllers/auditController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, checkRole(["Admin"]), getClinicAuditLogs);

export default router;
