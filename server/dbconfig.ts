import { Pool } from 'pg';

export default new Pool({
  max: 20,
  connectionString: process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/remindme',
  idleTimeoutMillis: 30000,
});
