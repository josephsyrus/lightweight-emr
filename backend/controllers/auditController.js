import pool from "../config/db.js";

export const getClinicAuditLogs = async (req, res) => {
  const { clinicId } = req.user;

  // Pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  try {
    const query = `
      SELECT 
        a.log_id, 
        a.action, 
        a.timestamp, 
        u.name AS staff_name, 
        u.role AS staff_role
      FROM auditlog a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.clinic_id = $1
      ORDER BY a.timestamp DESC
      LIMIT $2 OFFSET $3;
    `;

    const { rows } = await pool.query(query, [clinicId, limit, offset]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
