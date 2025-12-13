// ❗ Este es un Server Component por defecto
'use client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import DashboardNav from "@/src/components/dashboard/DashboardNav";

export default async function DashboardPage() {
  // 🔐 VERIFICAR AUTENTICACIÓN (igual que en el layout)
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // 📊 OBTENER DATOS ESPECÍFICOS PARA ESTA PÁGINA
  let userData = null;
  let stats = {};
  
  try {
    const userResult = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [session.user.id]
    );
    
    if (userResult.rows.length > 0) {
      userData = userResult.rows[0];
    }

    // Más consultas específicas...
    
  } catch (error) {
    console.error("Error:", error);
  }

  // 🎨 RENDERIZAR
  return (
    <div className="p-8">
      {/* Podrías pasar datos como props si quieres */}
      <DashboardNav userData={userData} stats={stats} />
    </div>
  );
}