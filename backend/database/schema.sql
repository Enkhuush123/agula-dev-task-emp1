CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  register_number TEXT NOT NULL UNIQUE,
  birth_date TEXT NOT NULL,
  phone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  policy_type TEXT NOT NULL CHECK(policy_type IN ('car', 'home', 'travel')),
  base_amount REAL NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  premium REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);