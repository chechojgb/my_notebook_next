'use client';

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  FileText, 
  Settings, 
  Bell, 
  User, 
  Search, 
  PlusCircle, 
  LogOut,
  ChevronDown,
  Menu,
  X,
  Notebook,
  Folder,
  Users,
  Calendar,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Detectar scroll para efecto de fondo
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Definir navegación
  const navigation = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: Home,
      description: "Vista general"
    },
    { 
      name: "Notas", 
      href: "/notes", 
      icon: FileText,
      description: "Tus notas",
      badge: "12"
    },
    { 
      name: "Proyectos", 
      href: "/projects", 
      icon: Folder,
      description: "Tus proyectos"
    },
    { 
      name: "Equipo", 
      href: "/team", 
      icon: Users,
      description: "Colaboradores"
    },
    { 
      name: "Calendario", 
      href: "/calendar", 
      icon: Calendar,
      description: "Eventos"
    },
  ];

  // Obtener inicial del nombre para el avatar
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || 'U';

  // Cerrar sesión
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  // Verificar si la ruta está activa
  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  if (status === 'loading') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Skeleton loading para logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            {/* Skeleton para avatar */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm' 
          : 'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO Y MENÚ MÓVIL */}
            <div className="flex items-center gap-4">
              {/* Botón menú móvil */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Notebook className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MyNotebook
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Dashboard
                  </p>
                </div>
              </Link>
            </div>

            {/* BÚSQUEDA (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar notas, proyectos..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* NAVEGACIÓN CENTRAL (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      active
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    <span>{item.name}</span>
                    
                    {/* Badge para notificaciones */}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Tooltip en hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* PERFIL Y ACCIONES */}
            <div className="flex items-center gap-3">
              {/* Botón crear (Desktop) */}
              <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105">
                <PlusCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Crear</span>
              </button>

              {/* Notificaciones */}
              <button className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Perfil del usuario */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Avatar con gradiente */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {userInitial}
                  </div>
                  
                  {/* Info del usuario (solo desktop) */}
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {session?.user?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[160px]">
                      {session?.user?.email || 'usuario@ejemplo.com'}
                    </p>
                  </div>
                  
                  {/* Flecha */}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Menú desplegable del perfil */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fadeIn">
                    {/* Header del perfil */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {userInitial}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {session?.user?.name || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {session?.user?.email || 'usuario@ejemplo.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enlaces del menú */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Mi perfil</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configuración</span>
                      </Link>
                      <Link
                        href="/premium"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Premium</span>
                        <span className="ml-auto text-xs px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                          PRO
                        </span>
                      </Link>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                    {/* Cerrar sesión */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BÚSQUEDA MÓVIL */}
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notas, proyectos..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl ${
                        active
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
                
                {/* Botón crear (Móvil) */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium">
                  <PlusCircle className="w-5 h-5" />
                  Crear nuevo
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Espacio para el navbar fijo */}
      <div className="h-16"></div>

      {/* Estilos para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}