// lib/notes.service.ts (crea este archivo nuevo)
import { Pool } from "@neondatabase/serverless";

// Configuración de conexión a Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

/**
 * Servicio MUY SIMPLE para manejar notas
 * Por ahora solo contamos notas
 */
export class NotesService {
  /**
   * Obtiene el TOTAL de notas de un usuario
   * @param userId - ID del usuario
   * @returns Número de notas (ej: 15)
   */
  static async getTotalNotes(userId: string): Promise<number> {
    try {
      console.log("📊 Consultando total de notas para usuario:", userId);
      
      // Ejecutar consulta SQL SIMPLE
      const result = await pool.query(
        "SELECT COUNT(*) as total FROM notes WHERE user_id = $1",
        [userId]
      );
      
      // Obtener el número
      const total = parseInt(result.rows[0]?.total || "0");
      
      console.log("✅ Total de notas encontradas:", total);
      return total;
      
    } catch (error) {
      console.error("❌ Error contando notas:", error);
      return 0; // Si hay error, retornamos 0
    }
  }
}