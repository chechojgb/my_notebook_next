import { db } from "./db";
import crypto from 'crypto';

export interface SessionData {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: Date;
  created_at: Date;
  user_email?: string;
  user_name?: string;
}

export class SessionManager {
  // Crear una sesión persistente
  static async createPersistentSession(
    userId: number, 
    durationDays: number = 30
  ): Promise<{ sessionToken: string; expiresAt: Date }> {
    try {
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      // Guardar en tabla sessions
      await db.query(
        `INSERT INTO sessions (user_id, session_token, expires_at) 
         VALUES ($1, $2, $3)`,
        [userId, sessionToken, expiresAt]
      );

      // También crear un remember_token en users
      const rememberToken = crypto.randomBytes(32).toString('hex');
      await db.query(
        "UPDATE users SET remember_token = $1 WHERE id = $2",
        [rememberToken, userId]
      );

      return { sessionToken, expiresAt };
    } catch (error) {
      console.error("Error creando sesión persistente:", error);
      throw error;
    }
  }

  // Validar sesión por token
  static async validateSession(token: string): Promise<SessionData | null> {
    try {
      const result = await db.query(
        `SELECT s.*, u.email as user_email, u.name as user_name
         FROM sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.session_token = $1 AND s.expires_at > NOW()`,
        [token]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error validando sesión:", error);
      return null;
    }
  }

  // Validar por remember_token
  static async validateRememberToken(token: string): Promise<SessionData | null> {
    try {
      const result = await db.query(
        `SELECT u.*, s.session_token
         FROM users u
         LEFT JOIN sessions s ON u.id = s.user_id AND s.expires_at > NOW()
         WHERE u.remember_token = $1`,
        [token]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      
      // Si no hay sesión activa, crear una nueva
      if (!user.session_token) {
        const newSession = await this.createPersistentSession(user.id, 30);
        return {
          id: user.id,
          user_id: user.id,
          session_token: newSession.sessionToken,
          expires_at: newSession.expiresAt,
          created_at: new Date(),
          user_email: user.email,
          user_name: user.name
        };
      }

      return {
        id: user.id,
        user_id: user.id,
        session_token: user.session_token,
        expires_at: new Date(user.expires_at),
        created_at: new Date(user.created_at),
        user_email: user.email,
        user_name: user.name
      };
    } catch (error) {
      console.error("Error validando remember token:", error);
      return null;
    }
  }

  // Eliminar sesión
  static async deleteSession(token: string): Promise<boolean> {
    try {
      await db.query(
        "DELETE FROM sessions WHERE session_token = $1",
        [token]
      );
      return true;
    } catch (error) {
      console.error("Error eliminando sesión:", error);
      return false;
    }
  }

  // Limpiar sesiones expiradas
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await db.query(
        "DELETE FROM sessions WHERE expires_at <= NOW()"
      );
    } catch (error) {
      console.error("Error limpiando sesiones:", error);
    }
  }

  // Obtener todas las sesiones activas de un usuario
  static async getUserSessions(userId: number): Promise<SessionData[]> {
    try {
      const result = await db.query(
        `SELECT * FROM sessions 
         WHERE user_id = $1 AND expires_at > NOW() 
         ORDER BY created_at DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo sesiones de usuario:", error);
      return [];
    }
  }
}