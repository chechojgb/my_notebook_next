import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "./db";
import { JWT } from "next-auth/jwt";

// Extender tipos
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      rememberMe?: boolean;
    } & Session["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rememberMe?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días por defecto
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Recordarme", type: "checkbox" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        try {
          // Buscar usuario
          const result = await db.query(
            "SELECT id, email, name, password FROM users WHERE email = $1",
            [credentials.email]
          );

          if (result.rows.length === 0) {
            throw new Error("Usuario no encontrado");
          }

          const user = result.rows[0];

          // Verificar contraseña
          const isValid = await compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Contraseña incorrecta");
          }

          // Si seleccionó "Recordarme", crear token y guardar en BD
          if (credentials.rememberMe === "true" || credentials.rememberMe === true) {
            const crypto = require('crypto');
            const rememberToken = crypto.randomBytes(32).toString('hex');
            
            // Guardar token en la base de datos
            await db.query(
              "UPDATE users SET remember_token = $1, updated_at = NOW() WHERE id = $2",
              [rememberToken, user.id]
            );
          }

          // Actualizar última conexión
          await db.query(
            "UPDATE users SET updated_at = NOW() WHERE id = $1",
            [user.id]
          );

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            rememberMe: credentials.rememberMe === "true" || credentials.rememberMe === true
          };
        } catch (error) {
          console.error("Error en autorización:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Inicializar token con datos del usuario
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.rememberMe = (user as any).rememberMe || false;
      }

      // Si el usuario seleccionó "Recordarme", extender la duración
      if (token.rememberMe) {
        token.maxAge = 365 * 24 * 60 * 60; // 1 año
      } else {
        token.maxAge = 24 * 60 * 60; // 1 día
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).rememberMe = token.rememberMe;
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // Verificar si hay un remember_token válido
      if (credentials?.rememberMe) {
        try {
          const crypto = require('crypto');
          const rememberToken = crypto.randomBytes(32).toString('hex');
          
          await db.query(
            "UPDATE users SET remember_token = $1 WHERE id = $2",
            [rememberToken, parseInt(user.id)]
          );
        } catch (error) {
          console.error("Error actualizando remember token:", error);
        }
      }
      return true;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};