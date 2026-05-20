// =============================================
// SATORI - Página de Registro
// =============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registrar } = useAuth();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'docente' });
  const [cargando, setCargando] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password) return toast.error('Completa todos los campos');
    if (form.password.length < 4) return toast.error('La contraseña debe tener al menos 4 caracteres');
    setCargando(true);
    try {
      const usuario = await registrar(form.nombre, form.email, form.password, form.rol);
      toast.success(`¡Cuenta creada, ${usuario.nombre}! 🎉`);
      navigate(usuario.rol === 'docente' ? '/dashboard' : '/unirse');
    } catch (err) {
      toast.error(err.message || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  const roles = [
    { value: 'docente',    label: '🎓 Docente',    desc: 'Crea y lanza cuestionarios' },
    { value: 'estudiante', label: '📚 Estudiante',  desc: 'Únete con código o QR' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(80px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-display font-black text-4xl gradient-text glow-purple">SATORI</h1>
            <p className="text-gray-500 text-sm mt-1 font-accent tracking-widest">悟り — CREAR CUENTA</p>
          </Link>
        </div>

        <div className="card p-8">
          <h2 className="font-display font-bold text-xl text-center text-white mb-6">Nueva Cuenta</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Selector de Rol */}
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-accent">Tipo de cuenta</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setForm(prev => ({ ...prev, rol: r.value }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.rol === r.value
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-700 bg-white/5 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="font-accent font-semibold text-sm">{r.label}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1 font-accent">Nombre completo</label>
              <input name="nombre" type="text" value={form.nombre} onChange={handleChange}
                placeholder="Prof. García" className="input" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1 font-accent">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="correo@ejemplo.com" className="input" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1 font-accent">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Mínimo 4 caracteres" className="input" />
            </div>

            <button type="submit" disabled={cargando}
              className="btn btn-primary w-full mt-2 text-base py-3">
              {cargando
                ? <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                : '🚀 Crear Cuenta'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Iniciar Sesión
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
