'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ChevronLeft,
  Sparkles,
  Notebook,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mensajes de URL parameters
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const registered = searchParams.get('registered');
  const verified = searchParams.get('verified');
  const reset = searchParams.get('reset');

  useEffect(() => {
    setIsVisible(true);
    
    // Mostrar mensajes según los parámetros de URL
    if (registered) {
      setSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
    }
    if (verified) {
      setSuccess('¡Email verificado correctamente! Ya puedes iniciar sesión.');
    }
    if (reset) {
      setSuccess('Contraseña restablecida correctamente. Inicia sesión con tu nueva contraseña.');
    }
  }, [registered, verified, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Usar NextAuth para iniciar sesión con credenciales
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false, // IMPORTANTE: Desactivar redirección automática
        callbackUrl: callbackUrl
      });

      console.log('Resultado del login:', result); // Para debug

      if (result?.error) {
        // Manejar diferentes tipos de errores
        if (result.error.includes('credentials') || result.error.includes('Credentials')) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (result.error.includes('not found') || result.error.includes('no encontrado')) {
          setError('Usuario no encontrado. Verifica tu email o crea una cuenta.');
        } else if (result.error.includes('password')) {
          setError('Contraseña incorrecta.');
        } else if (result.error.includes('Email') || result.error.includes('email')) {
          setError('Email y contraseña son requeridos.');
        } else {
          setError(`Error: ${result.error}`);
        }
      } else if (result?.ok && result?.url) {
        // Si el login fue exitoso, redirigir a la URL de callback
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        setTimeout(() => {
          router.push(result.url || '/dashboard');
          router.refresh(); // Refrescar la sesión
        }, 1000);
      } else {
        setError('Error desconocido. Intenta de nuevo.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Error de conexión. Por favor, verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar errores cuando el usuario empieza a escribir
    if (error) setError('');
  };

  // Back to Home - Diseño elegante
  const BackToHomeButton = () => (
    <Link 
      href="/" 
      className={`fixed top-6 left-6 z-50 group transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
          <div className="relative p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all duration-300">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
          Return Home
        </span>
      </div>
    </Link>
  );

  // Login Card - Estilo minimalista
  const LoginCard = () => (
    <div className={`relative w-full max-w-sm transition-all duration-700 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-5'}`}>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        
        {/* Header con gradiente sutil */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <Notebook className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          {/* Patrón geométrico */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-blue-500 rounded-lg rotate-45"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-purple-500 rounded-full"></div>
          </div>
        </div>

        <div className="p-8">
          {/* Mensajes de éxito/error */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to your notebook
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setHoverSubmit(true)}
              onMouseLeave={() => setHoverSubmit(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In
                  <LogIn className={`w-4 h-4 transition-transform ${hoverSubmit ? 'translate-x-1' : ''}`} />
                </div>
              )}
            </button>
          </form>

          {/* Divider - Eliminado temporalmente ya que no usamos Google/GitHub */}
          
          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* Fondo geométrico sutil */}
      <div className="fixed inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Home Button */}
      <BackToHomeButton />

      {/* Main Content */}
      <div className="container relative mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
        
        {/* Logo/Brand */}
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Notebook className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyNotebook
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Access Your Workspace
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your thoughts, notes, and ideas
          </p>
        </div>

        {/* Login Card */}
        <LoginCard />

        {/* Features en una línea */}
        <div className={`mt-8 flex flex-wrap justify-center gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Sync Across Devices</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Unlimited Notes</span>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;