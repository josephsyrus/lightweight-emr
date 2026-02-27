import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("Database connection failed:", err.stack);
  else console.log("Connected to Neon PostgreSQL at:", res.rows[0].now);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running normally." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/auditlogs", auditRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
