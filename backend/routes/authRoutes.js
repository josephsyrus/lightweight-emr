import express from "express";
import { registerClinic, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerClinic);
router.post("/login", login);

export default router;
