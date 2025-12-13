// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { SessionManager } from '@/src/lib/session-manager';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Rutas de autenticación
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  // Verificar token de NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si hay token, el usuario está autenticado
  if (token) {
    // Si está en ruta de autenticación, redirigir al dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Si no hay token, verificar cookies personalizadas para "Recordarme"
  const rememberToken = request.cookies.get('remember_token')?.value;
  
  if (rememberToken) {
    try {
      // Validar remember token
      const session = await SessionManager.validateRememberToken(rememberToken);
      
      if (session) {
        // Crear una respuesta y setear cookies de sesión
        const response = NextResponse.next();
        
        // Podrías regenerar el token aquí si lo necesitas
        // Por ahora, solo permitimos el acceso
        
        return response;
      }
    } catch (error) {
      console.error('Error validando remember token:', error);
    }
  }

  // Si es ruta protegida y no está autenticado, redirigir al login
  if (isProtectedRoute && !token && !rememberToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};