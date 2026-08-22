const bcrypt = require('bcryptjs');
const pool = require('./pool');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  specialty VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  date_of_birth DATE NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(160),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_time DATETIME NOT NULL,
  reason VARCHAR(255),
  status ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
`;

async function ensureSchemaAndSeed() {
  const conn = await pool.getConnection();
  try {
    for (const statement of SCHEMA.split(';').map(s => s.trim()).filter(Boolean)) {
      await conn.query(statement);
    }

    const [[{ count: userCount }]] = await conn.query('SELECT COUNT(*) as count FROM users');
    if (userCount === 0) {
      const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin123', 10);
      await conn.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin', process.env.SEED_ADMIN_EMAIL || 'admin@medtrack.local', hash, 'admin']
      );
      console.log('Seeded default admin user');
    }

    const [[{ count: doctorCount }]] = await conn.query('SELECT COUNT(*) as count FROM doctors');
    if (doctorCount === 0) {
      await conn.query(
        `INSERT INTO doctors (name, specialty) VALUES
         ('Dr. Asha Rao', 'General Medicine'),
         ('Dr. Marcus Chen', 'Cardiology'),
         ('Dr. Fatima Al-Sayed', 'Pediatrics'),
         ('Dr. Priya Nair', 'Orthopedics')`
      );
      console.log('Seeded doctors');
    }

    const [[{ count: patientCount }]] = await conn.query('SELECT COUNT(*) as count FROM patients');
    if (patientCount === 0) {
      await conn.query(
        `INSERT INTO patients (full_name, date_of_birth, phone, email) VALUES
         ('Ravi Kumar', '1988-03-14', '9876543210', 'ravi.kumar@example.com'),
         ('Emily Johnson', '1995-07-22', '9876500001', 'emily.j@example.com')`
      );
      console.log('Seeded sample patients');
    }
  } finally {
    conn.release();
  }
}

module.exports = { ensureSchemaAndSeed };
