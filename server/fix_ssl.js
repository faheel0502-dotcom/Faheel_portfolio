const fs = require('fs');
const files = ['init_db.js', 'seed_db.js', 'seed_whatido.js', 'seed_projects.js', 'seed_landing.js', 'seed_contact.js', 'seed_career.js', 'seed_about.js'];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/host: process\.env\.DB_HOST \|\| 'localhost',/g, 
    `host: process.env.DB_HOST || 'localhost',\n      port: process.env.DB_PORT || 3306,`);
  content = content.replace(/password: process\.env\.DB_PASSWORD \|\| 'Faheel'(,?)/g, 
    `password: process.env.DB_PASSWORD || 'Faheel',\n      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined$1`);
  fs.writeFileSync(f, content);
});
console.log("Done updating files!");
