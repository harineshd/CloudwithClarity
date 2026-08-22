const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('List doctors error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
