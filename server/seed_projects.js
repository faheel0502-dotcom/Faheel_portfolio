const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedProjects() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log("Connected to database. Updating projects table schema...");

    await connection.query(`DROP TABLE IF EXISTS projects`);
    
    await connection.query(`
      CREATE TABLE projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        tools VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        link VARCHAR(255) NOT NULL,
        sort_order INT DEFAULT 0
      )
    `);

    const projectsData = [
      ["Crescent Canteen", "College Food Ordering App", "React.js, Node.js, MySQL", "/images/callhq.png", "https://github.com/faheel0502-dotcom/Crescent_Canteen", 1],
      ["Student Mart", "Student Marketplace Platform", "React.js, Node.js, MySQL", "/images/whatsapp.png", "#", 2],
      ["Intellect Way", "Smart Traffic Navigation App", "HTML, CSS, Node.js, Weather API", "/images/broki.png", "#", 3],
      ["Doted On", "Figma UI/UX Design", "Figma, UI/UX", "/images/orrdr.png", "#", 4]
    ];

    for (const item of projectsData) {
      await connection.query(
        'INSERT INTO projects (title, category, tools, image, link, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        item
      );
    }

    console.log("✅ Seeded Projects page data!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedProjects();
