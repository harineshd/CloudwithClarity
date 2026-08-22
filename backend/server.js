require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pool = require('./db/pool');
const { ensureSchemaAndSeed } = require('./db/init');
const { requireAuth } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

const app = express();
app.use(cors());
app.use(express.json());

// Health check - this is what the ALB target group will hit in the cloud lab
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'unreachable' });
  }
});

// Simple dashboard summary - a stand-in for the kind of custom metric
// you'll later push to CloudWatch (e.g. AppointmentsBookedPerMinute)
app.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const [[patients]] = await pool.query('SELECT COUNT(*) as count FROM patients');
    const [[doctors]] = await pool.query('SELECT COUNT(*) as count FROM doctors');
    const [[appointments]] = await pool.query(
      "SELECT COUNT(*) as count FROM appointments WHERE status = 'scheduled'"
    );
    res.json({
      patients: patients.count,
      doctors: doctors.count,
      scheduledAppointments: appointments.count
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await ensureSchemaAndSeed();
    app.listen(PORT, () => {
      console.log(`MedTrack API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
