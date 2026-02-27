import express from "express";
import {
  registerPatient,
  searchPatient,
} from "../controllers/patientController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import { auditLogger } from "../middleware/auditLogger.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/",
  auditLogger,
  checkRole(["Receptionist", "Admin"]),
  registerPatient,
);
router.get(
  "/search",
  checkRole(["Receptionist", "Doctor", "Admin"]),
  searchPatient,
);

export default router;
