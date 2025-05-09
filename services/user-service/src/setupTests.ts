import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config({ path: '.env.test' });

let pool: Pool;

beforeAll(async () => {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'test_db',
    password: process.env.DB_PASSWORD || 'password',
    port: Number(process.env.DB_PORT) || 5432
  });

  // Create test database if it doesn't exist
  await pool.query('CREATE SCHEMA IF NOT EXISTS public');
});

// Clear database before each test
beforeEach(async () => {
  // Clear all tables
  await pool.query('TRUNCATE TABLE users, user_roles, login_history CASCADE');
});

// Close database connection after all tests
afterAll(async () => {
  await pool.end();
});

// Export the pool for use in tests
export { pool };
