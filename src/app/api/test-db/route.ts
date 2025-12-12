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
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message,
        connectionString: process.env.DATABASE_URL ? "✅ Existe" : "❌ No existe"
      },
      { status: 500 }
    );
  }
}