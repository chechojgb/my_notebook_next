
import { query } from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    
    // Validaciones básicas
    if (!email || !password || !name) {
      return Response.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return Response.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return Response.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insertar nuevo usuario
    const result = await query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, hashedPassword, name]
    );
    
    const newUser = result.rows[0];
    
    return Response.json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
    
  } catch (error) {
    console.error("Error en registro:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}