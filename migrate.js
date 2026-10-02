require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function runMigration() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    console.log('⏳ Running schema.sql...');
    await pool.query(schemaSql);
    console.log('✅ Schema created successfully.');

    console.log('⏳ Running seed.sql...');
    await pool.query(seedSql);
    console.log('✅ Seed data inserted successfully.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
