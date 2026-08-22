const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('List patients error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { full_name, date_of_birth, phone, email } = req.body;
  if (!full_name || !date_of_birth) {
    return res.status(400).json({ error: 'full_name and date_of_birth are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO patients (full_name, date_of_birth, phone, email) VALUES (?, ?, ?, ?)',
      [full_name, date_of_birth, phone || null, email || null]
    );
    res.status(201).json({ id: result.insertId, full_name, date_of_birth, phone, email });
  } catch (err) {
    console.error('Create patient error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
