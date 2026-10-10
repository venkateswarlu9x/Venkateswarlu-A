/**
 * MySQL Database Connection Configuration
 * Suitable for connecting to local MySQL / XAMPP / WAMP / MySQL Workbench.
 *
 * In this application, if MySQL server credentials are not provided or connection
 * fails, the backend automatically operates seamlessly using the in-memory relational
 * repository with the exact same tables, constraints, and seed data.
 */

import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_management_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log('[Database Config] Initialized with database:', dbConfig.database, 'on host:', dbConfig.host);
