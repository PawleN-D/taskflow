import { config } from 'dotenv';
import pg from 'pg';

config();

const { Pool } = pg;

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Show config (hide password)
  const dbUrl = process.env.DATABASE_URL || '';
  console.log('DATABASE_URL:', dbUrl.replace(/:[^:@]+@/, ':****@'));
  
  // Parse connection string
  const url = new URL(dbUrl);
  console.log('\nConnection details:');
  console.log('- Host:', url.hostname);
  console.log('- Port:', url.port);
  console.log('- Database:', url.pathname.slice(1));
  console.log('- User:', url.username);
  console.log('- Password:', '****' + url.password.slice(-4));
  
  // Try to connect
  const pool = new Pool({
    connectionString: dbUrl,
  });
  
  try {
    console.log('\n⏳ Attempting connection...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to database!');
    
    const result = await client.query('SELECT version()');
    console.log('\nPostgreSQL version:', result.rows[0].version.split(',')[0]);
    
    // Check if tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nExisting tables:', tables.rows.length);
    tables.rows.forEach(row => console.log('  -', row.table_name));
    
    client.release();
    await pool.end();
    
    console.log('\n✅ All checks passed!');
    process.exit(0);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('\n❌ Connection failed:', err.message);
    console.error('\nFull error:', err);
    await pool.end();
    process.exit(1);
  }
}

testConnection();