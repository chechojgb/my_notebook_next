"use server";

import { hash } from "bcrypt";
import { db } from "@/src/lib/db";
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
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return { error: "Este email ya está registrado" };
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Insertar usuario en la base de datos
    const result = await db.query(
      `INSERT INTO users (email, password, name, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING id, email, name`,
      [email, hashedPassword, name]
    );

    console.log("✅ Usuario registrado:", result.rows[0]);

    // REDIRECT - Esto lanzará NEXT_REDIRECT
    redirect("/login?registered=true");

  } catch (error) {
    // Ignorar el error de redirección
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-lanzar para que Next.js lo maneje
    }
    
    console.error("🔥 Error en registro:", error);
    return { error: "Error interno del servidor. Intenta de nuevo." };
  }
}