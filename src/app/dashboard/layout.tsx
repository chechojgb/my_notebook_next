// app/dashboard/layout.tsx (con metadata dinámica)
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { getServerUser } from "@/src/lib/server/user";
import DashboardNav from "@/src/components/dashboard/DashboardNav";
import type { Metadata } from 'next';

// ✅ Metadata dinámica basada en datos del servidor
export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      title: 'Acceso denegado - MyNotebook',
      description: 'Debes iniciar sesión para acceder al dashboard',
    };
  }

  // Obtener datos del usuario para personalizar metadata
  let userName = 'Usuario';
  try {
    const { user } = await getServerUser();
    if (user?.name) {
      userName = user.name;
    }
  } catch (error) {
    console.error("Error obteniendo datos para metadata:", error);
  }

  return {
    title: `Dashboard de ${userName} - MyNotebook`,
    description: `Panel de control personalizado de ${userName}`,
  };
}

// Componente de layout
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let initialData = { user: null, stats: null };
  
  try {
    const { user, stats } = await getServerUser();
    initialData = { user, stats };
  } catch (error) {
    console.error("Error obteniendo datos iniciales:", error);
  }

  return (
    <DashboardNav initialData={initialData}>
      {children}
    </DashboardNav>
  );
}