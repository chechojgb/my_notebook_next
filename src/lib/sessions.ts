import { db } from "./db";

export interface SessionData {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: Date;
  created_at: Date;
}

export async function createSession(userId: number): Promise<string | null> {
  try {
    const crypto = require('crypto');
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 días

    await db.query(
      `INSERT INTO sessions (user_id, session_token, expires_at) 
       VALUES ($1, $2, $3)`,
      [userId, sessionToken, expiresAt]
    );

    return sessionToken;
  } catch (error) {
    console.error("Error creando sesión:", error);
    return null;
  }
}

export async function validateSession(token: string): Promise<SessionData | null> {
  try {
    const result = await db.query(
      `SELECT s.*, u.email, u.name 
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

export async function deleteSession(token: string): Promise<boolean> {
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

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await db.query(
      "DELETE FROM sessions WHERE expires_at <= NOW()"
    );
  } catch (error) {
    console.error("Error limpiando sesiones expiradas:", error);
  }
}