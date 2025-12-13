import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function GET() {
  try {
    const result = await db.query("SELECT NOW() as time, version() as version");
    
    // Verificar tablas
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    return NextResponse.json({
      status: "connected",
      timestamp: result.rows[0].time,
      version: result.rows[0].version,
      tables: tables.rows.map(row => row.table_name),
      hasUsersTable: tables.rows.some(row => row.table_name === 'users'),
      hasSessionsTable: tables.rows.some(row => row.table_name === 'sessions')
    });
  } catch (error) {
    // Verificar que error es una instancia de Error
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { 
        status: "error", 
        message: errorMessage,
        connectionString: process.env.DATABASE_URL ? "✅ Existe" : "❌ No existe",
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } : null
      },
      { status: 500 }
    );
  }
}