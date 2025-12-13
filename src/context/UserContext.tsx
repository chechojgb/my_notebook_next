'use client';  // ❗ Esto es MUY importante: Indica que es un componente CLIENTE (se ejecuta en el navegador)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';  // Hook de NextAuth para obtener la sesión

// 📝 INTERFACES: Definimos cómo se ven nuestros datos (TypeScript)
interface UserData {
  id: number;           // ID numérico del usuario
  name: string;         // Nombre del usuario
  email: string;        // Email del usuario
  avatar?: string;      // Avatar opcional
  role?: string;        // Rol opcional (admin/user)
  createdAt: string;    // Fecha de creación (ISO string)
  updatedAt: string;    // Fecha de actualización
}

interface UserStats {
  totalNotes: number;      // Total de notas del usuario
  totalProjects: number;   // Total de proyectos
  activeTasks: number;     // Tareas activas
  completedTasks: number;  // Tareas completadas
}

// 📦 INTERFACE DEL CONTEXTO: Qué proveeremos a los componentes hijos
interface UserContextType {
  user: UserData | null;    // Datos del usuario o null si no hay
  stats: UserStats | null;  // Estadísticas o null
  loading: boolean;         // ¿Está cargando?
  error: string | null;     // Error si falla
  refresh: () => Promise<void>;  // Función para actualizar datos
}

// 🔧 CREAR EL CONTEXTO: Crea un "contenedor" global para los datos
const UserContext = createContext<UserContextType | undefined>(undefined);
// ⚠️ undefined inicial porque todavía no tenemos el Provider montado

// 🎯 COMPONENTE PROVIDER: Este componente ENVUELVE a toda la app
export function UserProvider({ 
  children,      // 👶 Los componentes hijos que envolverá
  initialData    // 📥 Datos iniciales del servidor (opcional para mejor performance)
}: { 
  children: ReactNode;
  initialData?: {
    user: UserData | null;
    stats: UserStats | null;
  };
}) {
  // 🔐 OBTENER SESIÓN: useSession() nos da info del usuario logueado
  const { data: session, status } = useSession();
  // session → datos del usuario autenticado
  // status → 'loading' | 'authenticated' | 'unauthenticated'

  // 🗃️ ESTADOS (useState): Donde guardamos los datos en el componente
  const [user, setUser] = useState<UserData | null>(initialData?.user || null);
  const [stats, setStats] = useState<UserStats | null>(initialData?.stats || null);
  const [loading, setLoading] = useState(!initialData?.user);  // Loading si NO hay datos iniciales
  const [error, setError] = useState<string | null>(null);

  // 🔄 FUNCIÓN PARA OBTENER DATOS: Llama a la API para obtener datos frescos
  const fetchUserData = async () => {
    // ⏳ Si NextAuth todavía está cargando, esperamos
    if (status === 'loading') return;
    
    // 🚫 Si no hay sesión (usuario no logueado), limpiamos todo
    if (!session?.user?.id) {
      setUser(null);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);      // 🟡 Activamos loading
      setError(null);        // 🟢 Limpiamos errores anteriores
      
      // 📞 LLAMADA A LA API: Fetch a nuestro endpoint /api/user
      const response = await fetch('/api/user', {
        headers: {
          'Cache-Control': 'no-cache'  // 🚫 Para que no cachee y siempre traiga datos frescos
        }
      });
      
      // ❌ Si la respuesta no es exitosa (200-299)
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // 📦 PARSEAR LA RESPUESTA: Convertir JSON a objeto JavaScript
      const data = await response.json();
      
      // ✅ Si la API dice que fue exitoso
      if (data.success) {
        setUser(data.data.user);      // 💾 Guardamos usuario
        setStats(data.data.stats || { // 💾 Guardamos estadísticas (o valores por defecto)
          totalNotes: 0,
          totalProjects: 0,
          activeTasks: 0,
          completedTasks: 0
        });
      } else {
        // ❌ Si la API devuelve error en el cuerpo
        throw new Error(data.error || 'Error al obtener datos del usuario');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // 🛡️ FALLBACK: Si falla pero tenemos sesión, creamos datos básicos
      if (!user) {
        setUser({
          id: parseInt(session.user.id),
          name: session.user.name || 'Usuario',
          email: session.user.email || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        setStats({
          totalNotes: 0,
          totalProjects: 0,
          activeTasks: 0,
          completedTasks: 0
        });
      }
    } finally {
      setLoading(false);  // 🟢 Siemparamos loading (éxito o error)
    }
  };

  // ⚡ useEffect: Se ejecuta CUANDO CAMBIAN estas dependencias
  useEffect(() => {
    // Solo hacer fetch si NO tenemos datos iniciales del servidor
    if (!initialData?.user) {
      fetchUserData();
    }
  }, [session, status, initialData]);  // 🔄 Se re-ejecuta cuando cambia la sesión

  // 🔄 FUNCIÓN PARA REFRESCAR: Los componentes hijos pueden forzar una actualización
  const refresh = async () => {
    await fetchUserData();
  };

  // 🎁 VALOR QUE PROVEE EL CONTEXTO: Todo lo que los hijos podrán consumir
  const value: UserContextType = {
    user,
    stats,
    loading,
    error,
    refresh
  };

  // 🌍 PROVEER EL CONTEXTO: Envuelve a los hijos con los datos
  return (
    <UserContext.Provider value={value}>
      {children}  {/* 👶 Los componentes hijos ahora tienen acceso al contexto */}
    </UserContext.Provider>
  );
}

// 🎣 HOOK PERSONALIZADO: Para usar el contexto fácilmente
export function useUser() {
  const context = useContext(UserContext);  // 🔍 Busca el contexto más cercano
  if (context === undefined) {
    // 💥 Error si usamos useUser FUERA del Provider
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;  // 🎯 Devuelve { user, stats, loading, error, refresh }
}