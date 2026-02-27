import express from "express";
import {
  openVisit,
  updateConsultation,
  orderLabs,
  updateLabResults,
  createPrescription,
  closeVisit,
  getPendingLabs,
  getActiveVisits,
} from "../controllers/visitController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import { auditLogger } from "../middleware/auditLogger.js";

const router = express.Router();

router.use(verifyToken);
router.use(auditLogger);

router.post("/", checkRole(["Receptionist", "Doctor"]), openVisit);
router.get(
  "/active",
  checkRole(["Doctor", "Admin", "Receptionist"]),
  getActiveVisits,
);
router.put("/:visitId/consultation", checkRole(["Doctor"]), updateConsultation);
router.get(
  "/labs/pending",
  checkRole(["LabTech", "Doctor", "Admin"]),
  getPendingLabs,
);
router.post("/:visitId/labs", checkRole(["Doctor"]), orderLabs);
router.put("/labs/:reportId/results", checkRole(["LabTech"]), updateLabResults);
router.post(
  "/:visitId/prescriptions",
  checkRole(["Doctor"]),
  createPrescription,
);
router.put(
  "/:visitId/close",
  checkRole(["Doctor", "Receptionist"]),
  closeVisit,
);

export default router;
