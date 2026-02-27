import pool from "../config/db.js";

export const openVisit = async (req, res) => {
  const { clinicId } = req.user;
  const { patientId, doctorId } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO visits (clinic_id, patient_id, user_id, status) VALUES ($1, $2, $3, 'Visit Opened') RETURNING *`,
      [clinicId, patientId, doctorId],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateConsultation = async (req, res) => {
  const { clinicId } = req.user;
  const { visitId } = req.params;
  const { symptoms, diagnosis, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE visits SET symptoms = $1, diagnosis = $2, status = $3 WHERE visit_id = $4 AND clinic_id = $5 RETURNING *`,
      [symptoms, diagnosis, status, visitId, clinicId],
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const orderLabs = async (req, res) => {
  const { clinicId } = req.user;
  const { visitId } = req.params;
  const { testName } = req.body;

  try {
    await pool.query(
      `INSERT INTO labreport (clinic_id, visit_id, test_name) VALUES ($1, $2, $3)`,
      [clinicId, visitId, testName],
    );

    await pool.query(
      `UPDATE visits SET status = 'Awaiting Lab Results' WHERE visit_id = $1 AND clinic_id = $2`,
      [visitId, clinicId],
    );
    res.status(201).json({ message: "Lab ordered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLabResults = async (req, res) => {
  const { clinicId } = req.user;
  const { reportId } = req.params;
  const { resultText, visitId } = req.body;

  try {
    await pool.query(
      `UPDATE labreport SET result = $1 WHERE report_id = $2 AND clinic_id = $3`,
      [resultText, reportId, clinicId],
    );
    await pool.query(
      `UPDATE visits SET status = 'Diagnosed' WHERE visit_id = $1 AND clinic_id = $2`,
      [visitId, clinicId],
    );
    res.status(200).json({ message: "Lab results updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPrescription = async (req, res) => {
  const { clinicId } = req.user;
  const { visitId } = req.params;
  const { medication, dosage, duration } = req.body;

  try {
    await pool.query(
      `INSERT INTO prescriptions (clinic_id, visit_id, medication, dosage, duration) VALUES ($1, $2, $3, $4, $5)`,
      [clinicId, visitId, medication, dosage, duration],
    );
    await pool.query(
      `UPDATE visits SET status = 'Prescribed' WHERE visit_id = $1 AND clinic_id = $2`,
      [visitId, clinicId],
    );
    res.status(201).json({ message: "Prescription added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const closeVisit = async (req, res) => {
  const { clinicId } = req.user;
  const { visitId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE visits SET status = 'Completed' WHERE visit_id = $1 AND clinic_id = $2 RETURNING *`,
      [visitId, clinicId],
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingLabs = async (req, res) => {
  const { clinicId } = req.user;

  try {
    // Join labreport, visits, and patients to get all necessary context
    const query = `
      SELECT 
        l.report_id, 
        l.test_name, 
        v.visit_id, 
        p.name AS patient_name,
        v.visit_date
      FROM labreport l
      JOIN visits v ON l.visit_id = v.visit_id
      JOIN patients p ON v.patient_id = p.patient_id
      WHERE l.clinic_id = $1 
        AND v.status = 'Awaiting Lab Results' 
        AND l.result IS NULL
      ORDER BY v.visit_date ASC;
    `;

    const { rows } = await pool.query(query, [clinicId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveVisits = async (req, res) => {
  const { clinicId } = req.user;
  try {
    const query = `
      SELECT v.visit_id, v.status, v.visit_date, p.name AS patient_name, p.age 
      FROM visits v
      JOIN patients p ON v.patient_id = p.patient_id
      WHERE v.clinic_id = $1 AND v.status != 'Completed'
      ORDER BY v.visit_date ASC;
    `;
    const { rows } = await pool.query(query, [clinicId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
