const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Create MySQL connection pool
const poolConfig = process.env.DATABASE_URL 
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '', // You will need to put your MySQL password in .env
      database: process.env.DB_NAME || 'portfolio_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined
    };

const pool = mysql.createPool(poolConfig);

// Test Database Connection
pool.getConnection()
  .then(conn => {
    console.log("Connected to MySQL Database!");
    conn.release();
  })
  .catch(err => {
    console.error("Database connection failed. Please ensure MySQL is running and credentials are correct in .env file.");
    console.error(err.message);
  });

// --- ROUTES ---

// Basic check
app.get('/', (req, res) => {
  res.send('Portfolio Backend is running');
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'password123'; // In production, this should be hashed in DB

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'portfolio_secret_key', { expiresIn: '1d' });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Example route to get all tech stack
app.get('/api/techstack', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tech_stack');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'portfolio_secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Example admin-only route to update tech stack
app.post('/api/admin/techstack', authenticateToken, async (req, res) => {
  const { name, category, url } = req.body;
  try {
    await pool.query('INSERT INTO tech_stack (name, category, url) VALUES (?, ?, ?)', [name, category, url]);
    res.json({ success: true, message: 'Tech stack added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all profile info
app.get('/api/profile', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM profile_info');
    // Convert array of rows into a key-value object
    const profileData = {};
    rows.forEach(row => {
      profileData[row.section] = row.content;
    });
    res.json(profileData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update specific profile section
app.post('/api/admin/profile', authenticateToken, async (req, res) => {
  const { section, content } = req.body;
  try {
    // Insert or update
    await pool.query(
      'INSERT INTO profile_info (section, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
      [section, content]
    );
    res.json({ success: true, message: 'Profile updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all career experience
app.get('/api/career', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM career ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add career experience
app.post('/api/admin/career', authenticateToken, async (req, res) => {
  const { role, company, date_range, description, sort_order } = req.body;
  try {
    await pool.query(
      'INSERT INTO career (role, company, date_range, description, sort_order) VALUES (?, ?, ?, ?, ?)',
      [role, company, date_range, description, sort_order || 0]
    );
    res.json({ success: true, message: 'Career item added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete career experience
app.delete('/api/admin/career/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM career WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Career item deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add project
app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  const { title, category, tools, image, github_link, live_link, sort_order } = req.body;
  try {
    await pool.query(
      'INSERT INTO projects (title, category, tools, image, github_link, live_link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, category, tools, image, github_link, live_link, sort_order || 0]
    );
    res.json({ success: true, message: 'Project added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project
app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  const { title, category, tools, image, github_link, live_link, sort_order } = req.body;
  try {
    await pool.query(
      'UPDATE projects SET title = ?, category = ?, tools = ?, image = ?, github_link = ?, live_link = ?, sort_order = ? WHERE id = ?',
      [title, category, tools, image, github_link, live_link, sort_order || 0, req.params.id]
    );
    res.json({ success: true, message: 'Project updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Project deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
