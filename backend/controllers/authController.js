import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerClinic = async (req, res) => {
  const { clinicName, address, contactNumber, adminName, email, password } =
    req.body;
  try {
    const clinicResult = await pool.query(
      `INSERT INTO clinics (clinic_name, address, contact_number) VALUES ($1, $2, $3) RETURNING clinic_id`,
      [clinicName, address, contactNumber],
    );
    const clinicId = clinicResult.rows[0].clinic_id;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO users (clinic_id, name, role, email, password_hash) VALUES ($1, $2, 'Admin', $3, $4)`,
      [clinicId, adminName, email, passwordHash],
    );

    res
      .status(201)
      .json({ message: "Clinic and Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    if (userResult.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.user_id, clinicId: user.clinic_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    res.status(200).json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
