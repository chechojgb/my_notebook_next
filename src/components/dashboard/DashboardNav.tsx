'use client';  // ❗ Componente CLIENTE (usa hooks y estado)

import { signOut } from "next-auth/react";  // 🔐 Para cerrar sesión
import Link from "next/link";
import { usePathname } from "next/navigation";  // 🧭 Para saber la ruta actual
import { useUser } from "@/src/context/UserContext";  // 🎣 Nuestro hook personalizado
import { 
  Home, FileText, Settings, Bell, User, Search, PlusCircle, LogOut 
} from "lucide-react";

export default function DashboardNav() {
  // 🧭 OBTENER RUTA ACTUAL: /dashboard, /dashboard/notes, etc.
  const pathname = usePathname();
  
  // 🎣 USAR NUESTRO CONTEXTO: ¡FÁCIL!
  const { user, loading } = useUser();

  // 🗺️ DEFINIR NAVEGACIÓN
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Notas", href: "/dashboard/notes", icon: FileText },
    { name: "Proyectos", href: "/dashboard/projects", icon: FileText },
    { name: "Perfil", href: "/dashboard/profile", icon: User },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings },
  ];

  // 🅰️ OBTENER INICIAL DEL NOMBRE para el avatar
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 🏷️ LOGO */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MyNotebook
              </span>
            </Link>
          </div>

          {/* 🧭 NAVEGACIÓN CENTRAL */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              // 🎯 Verificar si esta ruta está activa
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* 👤 PERFIL DEL USUARIO */}
          <div className="flex items-center gap-3">
            {loading ? (
              // ⏳ SKELETON LOADING: Placeholder mientras carga
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              </div>
            ) : (
              <>
                {/* 🖼️ AVATAR CON INICIAL */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {userInitial}
                </div>
                
                {/* 📝 INFO DEL USUARIO (solo en desktop) */}
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user?.email || 'usuario@ejemplo.com'}
                  </p>
                </div>

                {/* 🍔 MENÚ DESPLEGABLE */}
                <div className="relative group">
                  <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    {/* Icono de flecha */}
                  </button>
                  
                  {/* 📋 MENÚ DESPLEGABLE (aparece al hover) */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <div className="py-1">
                      {/* Enlaces del menú */}
                      <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}