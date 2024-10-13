import pg from "pg";

let config = {};

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
  };
} else {
  config = {
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    port: 54322,
    database: 'postgres',
    max: 10,
    idleTimeoutMillis: 30000,
  };
}

const pool = new pg.Pool(config);

pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
