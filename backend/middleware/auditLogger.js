import pool from "../config/db.js";

export const auditLogger = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    // Only log successful mutating requests (POST, PUT, DELETE)
    if (
      res.statusCode >= 200 &&
      res.statusCode < 300 &&
      ["POST", "PUT", "DELETE"].includes(req.method)
    ) {
      // Execute the log asynchronously so it doesn't block the response
      if (req.user && req.user.clinicId && req.user.userId) {
        const action = `${req.method} request to ${req.originalUrl}`;
        const query = `INSERT INTO auditlog (clinic_id, user_id, action) VALUES ($1, $2, $3)`;
        pool
          .query(query, [req.user.clinicId, req.user.userId, action])
          .catch((err) => console.error("Audit Log Error:", err));
      }
    }
    originalSend.call(this, data);
  };
  next();
};
