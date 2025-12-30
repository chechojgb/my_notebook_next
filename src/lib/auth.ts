// lib/auth.js - AÑADE LA EXPORTACIÓN DE authOptions
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "./db";
import bcrypt from "bcryptjs";

// ⭐️⭐️⭐️ authOptions está definido pero NO exportado ⭐️⭐️⭐️
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email y contraseña son requeridos");
          }

          const result = await query(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          );
          
          if (result.rows.length === 0) {
            throw new Error("Usuario no encontrado");
          }
          
          const user = result.rows[0];
          
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isValid) {
            throw new Error("Contraseña incorrecta");
          }
          
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("Error en authorize:", error.message);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Crear handler
const handler = NextAuth(authOptions);


export default handler;           // Handler por defecto (para API route)
export { handler as GET };        // Para export individual
export { handler as POST };       // Para export individual
export { authOptions };           // ¡IMPORTANTE! Exportar authOptions