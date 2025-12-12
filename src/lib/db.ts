import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para verificar conexión
export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión a DB exitosa:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a DB:', error);
    return false;
  }
}

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool
};