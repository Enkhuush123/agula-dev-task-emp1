const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "../../database/insurance.db");
const schemaPath = path.join(__dirname, "../../database/schema.sql");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

function initializeDatabase() {
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema, (err) => {
    if (err) {
      console.error("Failed to initialize database schema", err.message);
    } else {
      console.log("Database schema initialized");
    }
  });
}

module.exports = db;
