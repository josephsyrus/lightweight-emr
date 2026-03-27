import pool from "../config/db.js";
import bcrypt from "bcryptjs";

// NEW: Fetch all staff for the clinic
export const getStaff = async (req, res) => {
  const { clinicId } = req.user;
  try {
    const result = await pool.query(
      `SELECT user_id, name, role, email FROM users WHERE clinic_id = $1 ORDER BY role, name`,
      [clinicId],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

// NEW: Delete a staff member
export const removeStaff = async (req, res) => {
  const { clinicId, userId: requestingUser } = req.user;
  const { userId } = req.params;

  if (userId === requestingUser) {
    return res
      .status(400)
      .json({ error: "You cannot delete your own admin account." });
  }

  try {
    await pool.query(
      `DELETE FROM users WHERE user_id = $1 AND clinic_id = $2`,
      [userId, clinicId],
    );
    res.status(200).json({ message: "Staff member removed successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
