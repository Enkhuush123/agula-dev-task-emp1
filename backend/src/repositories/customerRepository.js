const db = require("../config/db");

function create(customer) {
  const { first_name, last_name, register_number, birth_date, phone } =
    customer;

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO customers (first_name, last_name, register_number, birth_date, phone)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [first_name, last_name, register_number, birth_date, phone],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            first_name,
            last_name,
            register_number,
            birth_date,
            phone,
          });
        }
      },
    );
  });
}

function findAll() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM customers ORDER BY id DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM customers WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function findByRegisterNumber(registerNumber) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM customers WHERE register_number = ?`,
      [registerNumber],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
}

module.exports = {
  create,
  findAll,
  findById,
  findByRegisterNumber,
};
