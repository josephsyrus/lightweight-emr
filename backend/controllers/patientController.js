import pool from "../config/db.js";

export const registerPatient = async (req, res) => {
  const { clinicId } = req.user;
  const { name, age, gender, phone, address } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO patients (clinic_id, name, age, gender, phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [clinicId, name, age, gender, phone, address],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505")
      return res
        .status(400)
        .json({ error: "Phone number already registered in this clinic." });
    res.status(500).json({ error: error.message });
  }
};

export const searchPatient = async (req, res) => {
  const { clinicId } = req.user;
  const { phone } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM patients WHERE clinic_id = $1 AND phone = $2`,
      [clinicId, phone],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Patient not found" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
