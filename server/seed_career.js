const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedCareer() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log("Connected to database. Creating career table...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS career (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        date_range VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        sort_order INT DEFAULT 0
      )
    `);

    // clear existing data just in case to prevent duplicates during testing
    await connection.query(`TRUNCATE TABLE career`);

    const items = [
      ["Full Stack Web Development Intern", "8 Queens Software Technologies Pvt. Ltd.", "Jun 2025 – Jul 2025", "Developed and implemented frontend interfaces using HTML, CSS, and JavaScript. Worked with relational databases and performed basic database design and querying.", 1],
      ["B.Tech Information Technology", "BSA Crescent Institute of Science and Technology", "Expected 2027", "Current CGPA: 7.77. Active in technical events: 3rd Place at HACK-ROOT Hackathon, 1st Place at IEEE Paper Presentation, Vice-President of TrailBlazers Coding Club.", 2],
      ["HSC (12th) & SSLC (10th)", "Gill Adarsh Matriculation Hr. Sec. School", "2021-2023", "Completed higher secondary education (81.6%) and secondary education under the Tamil Nadu State Board.", 3]
    ];

    for (const item of items) {
      await connection.query(
        'INSERT INTO career (role, company, date_range, description, sort_order) VALUES (?, ?, ?, ?, ?)',
        item
      );
    }

    console.log("✅ Seeded Career page data!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedCareer();
