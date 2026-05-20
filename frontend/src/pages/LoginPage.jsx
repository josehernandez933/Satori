// =============================================
// SATORI - Página de Login
// =============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Completa todos los campos');
    setCargando(true);
    try {
      const usuario = await login(form.email, form.password);
      toast.success(`¡Bienvenido, ${usuario.nombre}! 🚀`);
      navigate(usuario.rol === 'docente' ? '/dashboard' : '/unirse');
    } catch (err) {
      toast.error(err.message || 'Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Glow de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(80px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-display font-black text-4xl gradient-text glow-purple">SATORI</h1>
            <p className="text-gray-500 text-sm mt-1 font-accent tracking-widest">悟り — INICIAR SESIÓN</p>
          </Link>
        </div>

        {/* Card */}
        <div className="card p-8 animate-neon-border">
          <h2 className="font-display font-bold text-xl text-center text-white mb-6">
            Acceder a la Plataforma
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1 font-accent">Email</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="docente@escuela.edu"
                className="input" autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1 font-accent">Contraseña</label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="••••••••"
                className="input" autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="btn btn-primary w-full mt-2 text-base py-3"
            >
              {cargando ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : '⚡ Iniciar Sesión'}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.2)' }} />
            <span className="text-gray-500 text-xs">o</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.2)' }} />
          </div>

          {/* Unirse con código */}
          <button
            onClick={() => navigate('/unirse')}
            className="btn btn-outline w-full text-sm py-2.5"
          >
            🎮 Entrar como Estudiante (con código)
          </button>

          <p className="text-center text-gray-500 text-sm mt-5">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
      <footer className="absolute bottom-4 left-0 w-full text-center text-gray-500 text-xs font-accent">
        SATORI — Desarrollado con 💜 por <span className="gradient-text font-bold glow-purple">Jose Hernandez</span> — Universitario de la Universidad de Córdoba
      </footer>
    </div>
  );
}
