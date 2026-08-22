const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.appointment_time, a.reason, a.status,
              p.id as patient_id, p.full_name as patient_name,
              d.id as doctor_id, d.name as doctor_name, d.specialty
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors d ON d.id = a.doctor_id
       ORDER BY a.appointment_time DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('List appointments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { patient_id, doctor_id, appointment_time, reason } = req.body;
  if (!patient_id || !doctor_id || !appointment_time) {
    return res.status(400).json({ error: 'patient_id, doctor_id and appointment_time are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_time, reason) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_time, reason || null]
    );
    res.status(201).json({ id: result.insertId, patient_id, doctor_id, appointment_time, reason, status: 'scheduled' });
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    await pool.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [req.params.id]);
    res.json({ id: Number(req.params.id), status: 'cancelled' });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
