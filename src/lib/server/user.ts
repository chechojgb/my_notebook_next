// ❗ Este es un archivo de SERVIDOR (se ejecuta en Node.js, no en el navegador)

import { getServerSession } from "next-auth";  // Para obtener sesión en el servidor
import { authOptions } from "@/src/lib/auth";  // Configuración de NextAuth
import { db } from "@/src/lib/db";             // Conexión a la base de datos

// 📝 INTERFACES locales (solo para este archivo)
export interface ServerUserData {
  id: number;
  name: string;
  email: string;
  createdAt: Date;      // ❗ Date real, no string como en el cliente
  updatedAt: Date;
}

export interface ServerUserStats {
  totalNotes: number;
  totalProjects: number;
  activeTasks: number;
  completedTasks: number;
}

// 🎯 FUNCIÓN PRINCIPAL: Obtiene datos del usuario DESDE EL SERVIDOR
export async function getServerUser(): Promise<{
  user: ServerUserData | null;
  stats: ServerUserStats;
}> {
  // 🔐 OBTENER SESIÓN EN SERVIDOR: NextAuth tiene una versión para servidor
  const session = await getServerSession(authOptions);
  
  // 🚫 Si no hay sesión, devolvemos datos vacíos
  if (!session?.user?.id) {
    return {
      user: null,
      stats: {
        totalNotes: 0,
        totalProjects: 0,
        activeTasks: 0,
        completedTasks: 0
      }
    };
  }

  try {
    // 📊 CONSULTA 1: Datos básicos del usuario
    const userResult = await db.query(
      `SELECT id, name, email, created_at, updated_at 
       FROM users WHERE id = $1`,  // $1 es un parámetro (evita SQL injection)
      [session.user.id]  // El ID viene de la sesión
    );

    // 🚫 Si no encontramos al usuario (raro, pero puede pasar)
    if (userResult.rows.length === 0) {
      return {
        user: null,
        stats: {
          totalNotes: 0,
          totalProjects: 0,
          activeTasks: 0,
          completedTasks: 0
        }
      };
    }

    const userData = userResult.rows[0];  // 🎯 Primer (y único) resultado

    // 📊 CONSULTAS EN PARALELO: Más eficiente que hacerlas una por una
    const [notesResult, projectsResult] = await Promise.all([
      db.query("SELECT COUNT(*) as count FROM notes WHERE user_id = $1", [session.user.id]),
      db.query("SELECT COUNT(*) as count FROM projects WHERE user_id = $1", [session.user.id]),
    ]);

    // 🏗️ CONSTRUIR OBJETO USUARIO
    const user: ServerUserData = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      createdAt: userData.created_at,    // ⏰ Fecha desde PostgreSQL
      updatedAt: userData.updated_at,
    };

    // 🏗️ CONSTRUIR ESTADÍSTICAS
    const stats: ServerUserStats = {
      totalNotes: parseInt(notesResult.rows[0]?.count || "0"),      // Convertir string a número
      totalProjects: parseInt(projectsResult.rows[0]?.count || "0"),
      activeTasks: 0,     // 🔧 Aquí podrías agregar lógica real
      completedTasks: 0,  // 🔧 Aquí podrías agregar lógica real
    };

    return { user, stats };  // 🎁 Devolver todo
    
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    
    // 🛡️ FALLBACK: Datos mínimos basados en la sesión
    return {
      user: {
        id: parseInt(session.user.id),
        name: session.user.name || "Usuario",
        email: session.user.email || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      stats: {
        totalNotes: 0,
        totalProjects: 0,
        activeTasks: 0,
        completedTasks: 0
      }
    };
  }
}