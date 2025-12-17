// app/dashboard/layout.tsx
'use client'; // ⚠️ IMPORTANTE: Es Client Component por las animaciones

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { getServerSession } from "next-auth";
import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  Folder,
  Plus,
  Search,
  Bell,
  User,
  Settings,
  Star,
  HelpCircle,
  LogOut,
  ChevronDown,
  Clock,
  Zap,
  TrendingUp,
  X,
  Menu,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 2. Si no está autenticado, redirigir al login
  if (!session) {
    redirect("/login");
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.navbar-content')) {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowSearch(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Items de navegación
  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard', color: 'text-blue-500' },
    { icon: FileText, label: 'Notas', href: '/dashboard/notes', color: 'text-green-500' },
    { icon: BookOpen, label: 'Conocimiento', href: '/dashboard/knowledge', color: 'text-orange-500' },
    { icon: Calendar, label: 'Calendario', href: '/dashboard/calendar', color: 'text-pink-500' },
    { icon: Folder, label: 'Proyectos', href: '/dashboard/projects', color: 'text-indigo-500' },
  ];

  // Acciones rápidas
  const quickActions = [
    { icon: Plus, label: 'Nueva Nota', color: 'from-blue-500 to-cyan-500', href: '/dashboard/notes/new' },
    { icon: Folder, label: 'Nueva Carpeta', color: 'from-purple-500 to-pink-500', href: '/dashboard/folders/new' },
    { icon: Calendar, label: 'Agregar Evento', color: 'from-green-500 to-emerald-500', href: '/dashboard/calendar/new' },
  ];

  // Notificaciones (ejemplo)
  const notifications = [
    { id: 1, title: 'Reunión en 30 min', time: 'Hace 10 min', icon: Clock, unread: true },
    { id: 2, title: 'Fecha límite de proyecto', time: 'Hace 1 hora', icon: FileText, unread: true },
    { id: 3, title: 'Nueva característica añadida', time: 'Hace 2 horas', icon: Zap, unread: false },
    { id: 4, title: 'Reporte semanal listo', time: 'Hace 1 día', icon: TrendingUp, unread: false },
  ];

  // Menú de usuario
  const userMenuItems = [
    { icon: User, label: 'Perfil', href: '/dashboard/profile' },
    { icon: Settings, label: 'Configuración', href: '/dashboard/settings' },
    { icon: Star, label: 'Plan Premium', href: '/dashboard/upgrade' },
    { icon: HelpCircle, label: 'Ayuda y Soporte', href: '/dashboard/help' },
    { icon: LogOut, label: 'Cerrar Sesión', color: 'text-red-500', action: () => signOut({ callbackUrl: '/login' }) },
  ];

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Si está cargando la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no hay sesión, mostrar nada (será redirigido)
  if (!session) {
    return null;
  }

  return (
    <>
      {/* Navbar Principal */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-content">
          <div className="flex justify-between h-16">
            
            {/* Logo y Brand */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 border-2 border-blue-400/30 border-t-transparent rounded-full"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      MyNotebook
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tu espacio de conocimiento</p>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                    {pathname === item.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Quick Create Button */}
              <motion.div
                className="relative"
                whileHover="hover"
                initial="initial"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard/notes/new')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Crear</span>
                </motion.button>
                
                {/* Quick Actions Dropdown */}
                <AnimatePresence>
                  {false && ( // Cambia a true para ver el dropdown
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {quickActions.map((action) => (
                        <Link
                          key={action.label}
                          href={action.href}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{action.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg dark:text-white">Notificaciones</h3>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            {notifications.filter(n => n.unread).length} nuevas
                          </span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <notification.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium dark:text-white">{notification.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="text-blue-600 dark:text-blue-400 font-medium w-full text-center hover:underline">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            {session.user?.image ? (
                              <img 
                                src={session.user.image} 
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold dark:text-white">
                              {session.user?.name || 'Usuario'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            Plan Básico
                          </span>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                            Activo
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems.map((item, index) => (
                          <motion.button
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              if (item.action) {
                                item.action();
                              } else if (item.href) {
                                router.push(item.href);
                              }
                              setShowUserMenu(false);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${item.color || 'text-gray-700 dark:text-gray-300'}`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar Full Width */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSearch} className="py-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar notas, fechas, conocimiento..."
                      className="w-full pl-12 pr-24 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500"
                      autoFocus
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                        Presiona ⌘K para buscar
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {quickActions.map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br ${action.color} text-white`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <action.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">{action.label}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {session.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{session.user?.name || 'Usuario'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ver perfil</p>
                      </div>
                    </div>
                    <Link 
                      href="/dashboard/settings"
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Floating Action Button para móviles */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/dashboard/notes/new')}
        className="fixed bottom-6 right-6 lg:hidden z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Espacio para el navbar fijo */}
      <div className="h-16" />

      {/* Contenido principal */}
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {children}
      </main>
    </>
  );
}