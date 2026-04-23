const db = require("../config/db");

function create(policy) {
  const {
    customer_id,
    policy_type,
    base_amount,
    start_date,
    end_date,
    premium,
    status,
  } = policy;

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO policies (
        customer_id, policy_type, base_amount, start_date, end_date, premium, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        customer_id,
        policy_type,
        base_amount,
        start_date,
        end_date,
        premium,
        status,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            customer_id,
            policy_type,
            base_amount,
            start_date,
            end_date,
            premium,
            status,
          });
        }
      },
    );
  });
}

function findAll(filters = {}) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM policies WHERE 1=1`;
    const params = [];

    if (filters.customer_id) {
      query += ` AND customer_id = ?`;
      params.push(filters.customer_id);
    }

    if (filters.status) {
      query += ` AND status = ?`;
      params.push(filters.status);
    }

    query += ` ORDER BY id DESC`;

    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM policies WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function findByCustomerId(customerId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM policies WHERE customer_id = ? ORDER BY id DESC`,
      [customerId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
}

function updateStatus(id, status) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE policies SET status = ? WHERE id = ?`,
      [status, id],
      function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes > 0 });
      },
    );
  });
}

module.exports = {
  create,
  findAll,
  findById,
  findByCustomerId,
  updateStatus,
};
