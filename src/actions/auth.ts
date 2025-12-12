"use server";

import { hash } from "bcrypt";
import { db } from "../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    console.log("📝 Datos recibidos:", { email, name, password: "***" });

    // Validaciones
    if (!email || !password || !name) {
      return { error: "Todos los campos son obligatorios" };
    }

    if (password.length < 6) {
      return { error: "La contraseña debe tener al menos 6 caracteres" };
    }

    if (!email.includes("@")) {
      return { error: "Email inválido" };
    }

    // Verificar si el usuario ya existe
    try {
      const existingUser = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return { error: "Este email ya está registrado" };
      }
    } catch (dbError) {
      console.error("❌ Error verificando usuario:", dbError);
      return { error: "Error al verificar usuario" };
    }

    // Hashear la contraseña
    let hashedPassword: string;
    try {
      hashedPassword = await hash(password, 12);
    } catch (hashError) {
      console.error("❌ Error hasheando contraseña:", hashError);
      return { error: "Error al procesar contraseña" };
    }

    // Insertar usuario en la base de datos
    try {
      const result = await db.query(
        `INSERT INTO users (email, password, name, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         RETURNING id, email, name`,
        [email, hashedPassword, name]
      );

      console.log("✅ Usuario registrado:", result.rows[0]);

      // También podrías crear una sesión aquí si lo deseas
      // await createSession(result.rows[0].id);

      // Redirigir al login después de registro exitoso
      revalidatePath("/login");
      redirect("/login?registered=true");

    } catch (insertError) {
      console.error("❌ Error insertando usuario:", insertError);
      return { error: "Error al registrar usuario en la base de datos" };
    }

  } catch (error) {
    console.error("🔥 Error general en registro:", error);
    return { error: "Error interno del servidor. Intenta de nuevo." };
  }
}

// Función opcional para crear sesión después del registro
async function createSession(userId: number) {
  try {
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 días

    await db.query(
      `INSERT INTO sessions (user_id, session_token, expires_at, created_at) 
       VALUES ($1, $2, $3, NOW())`,
      [userId, sessionToken, expiresAt]
    );

    return sessionToken;
  } catch (error) {
    console.error("Error creando sesión:", error);
    return null;
  }
}