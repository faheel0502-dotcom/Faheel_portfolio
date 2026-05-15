const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDB() {
  try {
    // Connect without database selected to create it first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined
    });

    console.log("Connected to MySQL Server.");

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'portfolio_db'}\`;`);
    console.log(`Database '${process.env.DB_NAME || 'portfolio_db'}' created or already exists.`);

    // Use database
    await connection.query(`USE \`${process.env.DB_NAME || 'portfolio_db'}\`;`);

    // Create tech_stack table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tech_stack (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255)
      );
    `);
    console.log("Table 'tech_stack' created or already exists.");

    // Create projects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        imageUrl VARCHAR(255),
        githubUrl VARCHAR(255),
        liveUrl VARCHAR(255)
      );
    `);
    console.log("Table 'projects' created or already exists.");

    // Create profile/about table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS profile_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL
      );
    `);
    console.log("Table 'profile_info' created or already exists.");

    console.log("✅ Database initialization complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
    process.exit(1);
  }
}

initializeDB();
