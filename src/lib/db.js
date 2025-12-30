import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

/**
 * query
 * Ejecuta consultas SQL usando el pool de PostgreSQL
 *
 * @param {string} text - SQL query
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise<QueryResult>}
 */
export const query = (text, params) => {
  return pool.query(text, params);
};

export default pool;
