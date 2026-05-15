const mysql = require('mysql2/promise');
require('dotenv').config();

const whatIDoData = [
  { section: 'whatido_1_title', content: "FULL STACK DEVELOPMENT" },
  { section: 'whatido_1_subtitle', content: "Building Responsive Web Applications" },
  { section: 'whatido_1_desc', content: "I specialize in developing robust full-stack applications with real-time features, secure payment gateways, and scalable database architectures." },
  { section: 'whatido_2_title', content: "BACKEND & INTEGRATIONS" },
  { section: 'whatido_2_subtitle', content: "Secure APIs & Payment Systems" },
  { section: 'whatido_2_desc', content: "Experienced in designing RESTful APIs, managing complex relational databases, and integrating third-party services like Razorpay for seamless user experiences." }
];

async function seedWhatIDo() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log("Connected to database to seed What I Do page...");

    for (const item of whatIDoData) {
      await connection.query(
        'INSERT INTO profile_info (section, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
        [item.section, item.content]
      );
    }

    console.log("✅ Seeded What I Do page text!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedWhatIDo();
