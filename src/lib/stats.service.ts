// lib/stats.service.ts
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export interface UserStats {
  totalNotes: number;
  activeCategories: number;
  favoriteNotes: number;
  weeklyActivity: number;
  notesPerDay: number;
  categories: Array<{ name: string; count: number }>;
  recentNotes: Array<{ id: string; title: string; updatedAt: Date }>;
}

export class StatsService {
  /**
   * Obtiene estadísticas del usuario desde la base de datos
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      const [
        totalNotesResult,
        activeCategoriesResult,
        favoriteNotesResult,
        weeklyActivityResult,
        categoriesResult,
        recentNotesResult,
        notesPerDayResult
      ] = await Promise.all([
        // 1. Total de notas
        pool.query(
          `SELECT COUNT(*) as count FROM notes WHERE user_id = $1 AND deleted_at IS NULL`,
          [userId]
        ),

        // 2. Categorías activas
        pool.query(
          `SELECT COUNT(DISTINCT category_id) as count 
           FROM notes 
           WHERE user_id = $1 AND deleted_at IS NULL AND category_id IS NOT NULL`,
          [userId]
        ),

        // 3. Notas favoritas
        pool.query(
          `SELECT COUNT(*) as count FROM notes WHERE user_id = $1 AND is_favorite = true AND deleted_at IS NULL`,
          [userId]
        ),

        // 4. Actividad semanal (notas creadas o actualizadas en los últimos 7 días)
        pool.query(
          `SELECT COUNT(*) as count 
           FROM notes 
           WHERE user_id = $1 
           AND deleted_at IS NULL 
           AND (created_at >= NOW() - INTERVAL '7 days' OR updated_at >= NOW() - INTERVAL '7 days')`,
          [userId]
        ),

        // 5. Categorías con conteo
        pool.query(
          `SELECT c.name, COUNT(n.id) as count
           FROM categories c
           LEFT JOIN notes n ON c.id = n.category_id AND n.user_id = $1 AND n.deleted_at IS NULL
           WHERE c.user_id = $1
           GROUP BY c.id, c.name
           ORDER BY count DESC
           LIMIT 5`,
          [userId]
        ),

        // 6. Notas recientes
        pool.query(
          `SELECT id, title, updated_at as "updatedAt"
           FROM notes 
           WHERE user_id = $1 AND deleted_at IS NULL
           ORDER BY updated_at DESC 
           LIMIT 5`,
          [userId]
        ),

        // 7. Promedio de notas por día (últimos 30 días)
        pool.query(
          `SELECT ROUND(COUNT(*)::DECIMAL / 30, 1) as average
           FROM notes 
           WHERE user_id = $1 
           AND deleted_at IS NULL 
           AND created_at >= NOW() - INTERVAL '30 days'`,
          [userId]
        )
      ]);

      // Calcular cambio porcentual (simulado - en producción usarías datos históricos)
      const calculateChange = (current: number): string => {
        const previous = current * 0.85; // Simulación: 15% menos que el actual
        const change = ((current - previous) / previous) * 100;
        return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
      };

      const totalNotes = parseInt(totalNotesResult.rows[0]?.count || '0');
      const notesPerDay = parseFloat(notesPerDayResult.rows[0]?.average || '0');

      return {
        totalNotes,
        activeCategories: parseInt(activeCategoriesResult.rows[0]?.count || '0'),
        favoriteNotes: parseInt(favoriteNotesResult.rows[0]?.count || '0'),
        weeklyActivity: parseInt(weeklyActivityResult.rows[0]?.count || '0'),
        notesPerDay,
        categories: categoriesResult.rows.map(row => ({
          name: row.name,
          count: parseInt(row.count || '0')
        })),
        recentNotes: recentNotesResult.rows.map(row => ({
          id: row.id,
          title: row.title,
          updatedAt: new Date(row.updatedAt)
        })),
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas en tiempo real para el dashboard
   */
  static async getDashboardStats(userId: string) {
    const stats = await this.getUserStats(userId);
    
    return [
      { 
        label: 'Total notas', 
        value: stats.totalNotes.toString(), 
        icon: 'FileText', 
        change: calculateChange(stats.totalNotes), 
        color: 'bg-blue-50 border-blue-200',
        description: 'Notas creadas en total'
      },
      { 
        label: 'Categorías activas', 
        value: stats.activeCategories.toString(), 
        icon: 'Folder', 
        change: `+${Math.floor(Math.random() * 3)}`, // Simulación
        color: 'bg-green-50 border-green-200',
        description: 'Categorías con contenido'
      },
      { 
        label: 'Notas favoritas', 
        value: stats.favoriteNotes.toString(), 
        icon: 'Star', 
        change: `+${Math.floor(Math.random() * 3)}`, // Simulación
        color: 'bg-yellow-50 border-yellow-200',
        description: 'Marcadas como favoritas'
      },
      { 
        label: 'Actividad diaria', 
        value: `${stats.notesPerDay}/día`, 
        icon: 'TrendingUp', 
        change: calculateChange(stats.weeklyActivity), 
        color: 'bg-purple-50 border-purple-200',
        description: 'Promedio últimos 30 días'
      },
    ];
  }

  /**
   * Obtiene el historial de actividad
   */
  static async getActivityHistory(userId: string, days: number = 30) {
    const { rows } = await pool.query(
      `SELECT 
          DATE(created_at) as date,
          COUNT(*) as notes_created,
          SUM(CASE WHEN is_favorite THEN 1 ELSE 0 END) as favorites_added
       FROM notes
       WHERE user_id = $1 
         AND deleted_at IS NULL 
         AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [userId]
    );

    return rows.map(row => ({
      date: new Date(row.date),
      notesCreated: parseInt(row.notes_created),
      favoritesAdded: parseInt(row.favorites_added)
    }));
  }
}

// Helper function para calcular cambios
function calculateChange(current: number): string {
  const change = Math.floor(Math.random() * 20) - 5; // Simulación: -5% a +15%
  return change > 0 ? `+${change}%` : `${change}%`;
}