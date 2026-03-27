import express from "express";
import {
  addStaff,
  getStaff,
  removeStaff,
} from "../controllers/userController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import { auditLogger } from "../middleware/auditLogger.js";

const router = express.Router();

router.use(verifyToken);
router.use(auditLogger);

router.get("/", checkRole(["Admin"]), getStaff);
router.post("/", checkRole(["Admin"]), addStaff);
router.delete("/:userId", checkRole(["Admin"]), removeStaff);

export default router;
