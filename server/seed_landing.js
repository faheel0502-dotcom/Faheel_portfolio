const mysql = require('mysql2/promise');
require('dotenv').config();

const landingData = [
  { section: 'landing_greeting', content: "Hello! I'm" },
  { section: 'landing_name_first', content: "MOHAMMED" },
  { section: 'landing_name_last', content: "FAHEEL M" },
  { section: 'landing_role_prefix', content: "B.Tech IT Student &" },
  { section: 'landing_role_1', content: "Software" },
  { section: 'landing_role_2', content: "Developer" }
];

async function seedLanding() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log("Connected to database to seed Landing page...");

    for (const item of landingData) {
      await connection.query(
        'INSERT INTO profile_info (section, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
        [item.section, item.content]
      );
    }

    console.log("✅ Seeded Landing page text!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedLanding();
