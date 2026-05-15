const mysql = require('mysql2/promise');
require('dotenv').config();

const contactData = [
  { section: 'contact_linkedin_url', content: "https://www.linkedin.com/in/mohammed-faheel-318b6633b/" },
  { section: 'contact_linkedin_text', content: "LinkedIn — faheelm" },
  { section: 'contact_edu_1', content: "B.Tech Information Technology, BSA Crescent Institute — Expected 2027" },
  { section: 'contact_edu_2', content: "HSC, Gill Adarsh Matriculation Hr. Sec. School — 2021–2023" },
  { section: 'contact_github_url', content: "https://github.com/faheel0502" },
  { section: 'contact_designed_by', content: "Mohammed Faheel M" },
  { section: 'contact_year', content: "2026" },
];

async function seedContact() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log("Connected to database to seed Contact page...");

    for (const item of contactData) {
      await connection.query(
        'INSERT INTO profile_info (section, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
        [item.section, item.content]
      );
    }

    console.log("✅ Seeded Contact page text!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedContact();
