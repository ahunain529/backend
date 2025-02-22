const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_fz78TnODrKpw@ep-quiet-paper-a1xykuza-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL at:', res.rows[0].now);
  }
});

// API to save data to PostgreSQL
app.post('/save-data', async (req, res) => {
  const { name, fatherName, phoneNumber, gender, dob, doi, doe, identityNumber } = req.body;

  try {
    const query = `
      INSERT INTO personal_data (name, fatherName, phoneNumber, gender, dob, doi, doe, identityNumber)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (identityNumber) DO NOTHING;
    `;

    const values = [name, fatherName, phoneNumber, gender, dob, doi, doe, identityNumber];

    await pool.query(query, values);
    res.status(200).json({ message: 'Data saved to PostgreSQL!' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data to PostgreSQL' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});