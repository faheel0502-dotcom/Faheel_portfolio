const mysql = require('mysql2/promise');
require('dotenv').config();

const techCategories = [
  { category: "Frontend", skills: ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3"] },
  { category: "Backend", skills: ["Node.js", "Express.js"] },
  { category: "Database", skills: ["MySQL", "MongoDB", "PostgreSQL"] },
  { category: "Languages", skills: ["JavaScript", "TypeScript", "Python", "C++"] },
  { category: "Tools & Libraries", skills: ["Git & GitHub", "Socket.IO", "Razorpay", "Postman"] },
];

async function seedDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Faheel',
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log("Connected to database for seeding...");

    // Clear existing data to avoid duplicates
    await connection.query('TRUNCATE TABLE tech_stack');

    // Insert each skill
    for (const group of techCategories) {
      for (const skill of group.skills) {
        // Find url if it exists in our hardcoded image array, otherwise leave blank
        let url = "";
        if (skill === "React.js") url = "/images/react2.webp";
        else if (skill === "Next.js") url = "/images/next2.webp";
        else if (skill === "Node.js") url = "/images/node2.webp";
        else if (skill === "Express.js") url = "/images/express.webp";
        else if (skill === "MongoDB") url = "/images/mongo.webp";
        else if (skill === "MySQL") url = "/images/mysql.webp";
        else if (skill === "TypeScript") url = "/images/typescript.webp";
        else if (skill === "JavaScript") url = "/images/javascript.webp";
        
        await connection.query('INSERT INTO tech_stack (category, name, url) VALUES (?, ?, ?)', [group.category, skill, url]);
      }
    }

    console.log("✅ Seeded tech_stack table with initial data!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedDB();
