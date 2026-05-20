// =============================================
// SATORI - Landing Page
// Hero animado estilo anime futurista
// =============================================

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Partícula flotante del fondo
function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(168,85,247,0.6), transparent)',
        animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 3}s`,
        ...style
      }}
    />
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const canvasRef = useRef(null);

  // Redirigir si ya tiene sesión
  useEffect(() => {
    if (usuario?.rol === 'docente') navigate('/dashboard');
  }, [usuario]);

  // Partículas aleatorias
  const particulas = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    style: {
      width:  `${4 + Math.random() * 8}px`,
      height: `${4 + Math.random() * 8}px`,
      left:   `${Math.random() * 100}%`,
      top:    `${Math.random() * 100}%`,
      opacity: 0.3 + Math.random() * 0.5,
    }
  }));

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">

      {/* ── Fondo con partículas ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particulas.map(p => <Particle key={p.id} style={p.style} />)}
        {/* Gradientes de fondo */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(60px)' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 glass border-b border-purple-500/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <span className="font-display font-black text-white text-sm">悟</span>
          </div>
          <span className="font-display font-bold text-xl gradient-text">SATORI</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <button onClick={() => navigate('/login')} className="btn btn-outline text-sm px-4 py-2">
            Iniciar Sesión
          </button>
          <button onClick={() => navigate('/registro')} className="btn btn-primary text-sm px-4 py-2">
            Registrarse
          </button>
        </motion.div>
      </nav>

      {/* ── Hero Principal ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">

        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="badge badge-purple mb-6 text-sm px-4 py-1"
        >
          ⚡ Plataforma de Aprendizaje en Tiempo Real
        </motion.div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="font-display font-black leading-none mb-2"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}>
            <span className="gradient-text glow-purple">SATORI</span>
          </h1>
          <div className="font-accent text-xl md:text-2xl text-gray-300 tracking-widest">
            悟り — ILUMINACIÓN DIGITAL
          </div>
        </motion.div>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-gray-400 max-w-lg text-lg mb-10 leading-relaxed"
        >
          Plataforma de quizzes interactivos en tiempo real para educación tecnológica.
          <br />
          <span className="text-purple-400">Compite, aprende y domina</span> los fundamentos de redes.
        </motion.p>

        {/* Botones CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <button
            onClick={() => navigate('/registro')}
            className="btn btn-primary text-lg px-8 py-4 animate-pulse-glow"
          >
            <span>🎓</span> Soy Docente
          </button>
          <button
            onClick={() => navigate('/unirse')}
            className="btn btn-cyan text-lg px-8 py-4"
          >
            <span>🎮</span> Unirme a Partida
          </button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full"
        >
          {[
            { icon: '⚡', titulo: 'Tiempo Real', desc: 'Socket.io para sincronización instantánea entre todos los dispositivos' },
            { icon: '🏆', titulo: 'Ranking Dinámico', desc: 'Puntaje basado en velocidad y precisión. Podio con efectos animados' },
            { icon: '📡', titulo: 'Redes & Tecnología', desc: '35+ preguntas del modelo OSI, TCP/IP, protocolos y seguridad' },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, boxShadow: '0 0 25px rgba(168,85,247,0.3)' }}
              className="card text-left p-5"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-purple-300 mb-1 text-sm">{f.titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center py-6 text-gray-500 text-xs font-accent flex flex-col gap-1 items-center justify-center border-t border-purple-500/10 mt-12">
        <div>SATORI © 2026 — Plataforma Educativa Interactiva</div>
        <div className="text-gray-400 mt-1">
          Desarrollado con 💜 por <span className="gradient-text font-bold glow-purple">Jose Hernandez</span> — Universitario de la Universidad de Córdoba
        </div>
      </footer>
    </div>
  );
}
