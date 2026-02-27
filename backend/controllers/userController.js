import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const addStaff = async (req, res) => {
  const { clinicId } = req.user;
  const { name, role, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (clinic_id, name, role, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, role`,
      [clinicId, name, role, email, passwordHash],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
