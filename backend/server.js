import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
  } else {
    console.log("Connected to Neon PostgreSQL at:", res.rows[0].now);
  }
});

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running normally." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
