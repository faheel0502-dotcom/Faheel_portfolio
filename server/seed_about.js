const mysql = require('mysql2/promise');
require('dotenv').config();

const aboutData = [
  { section: 'about_text', content: "I am a motivated 3rd-year B.Tech IT student at BSA Crescent Institute of Science and Technology. I specialize in full stack web development with hands-on experience in React.js, Node.js, and the MEAN stack. I combine technical expertise with leadership skills to craft dynamic web applications. From front-end engineering to database design, I bridge the gap to ensure that concepts are brought to life with flawless execution." },
];

async function seedAbout() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log("Connected to database to seed About page...");

    for (const item of aboutData) {
      await connection.query(
        'INSERT INTO profile_info (section, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
        [item.section, item.content]
      );
    }

    console.log("✅ Seeded About page text!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedAbout();
