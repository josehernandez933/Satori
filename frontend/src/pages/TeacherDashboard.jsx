// =============================================
// SATORI - Panel del Docente
// Dashboard principal con cuestionarios e historial
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { quizzesAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { useGame } from '../context/GameContext';
import { QRCodeSVG } from 'qrcode.react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { emit, on } = useSocket();
  const { setSala, setEstado, resetGame } = useGame();

  const [quizzes, setQuizzes]         = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [salaActiva, setSalaActiva]   = useState(null); // { codigo, sala }
  const [modalQR, setModalQR]         = useState(false);

  // Cargar cuestionarios del docente
  useEffect(() => {
    cargarQuizzes();
  }, []);

  // Escuchar evento sala-creada
  useEffect(() => {
    const off = on('sala-creada', ({ codigo, sala }) => {
      setSalaActiva({ codigo, sala });
      setSala(sala);
      setEstado('esperando');
      setModalQR(true);
      toast.success(`✅ Sala creada: ${codigo}`);
    });

    const offError = on('error-sala', ({ mensaje }) => toast.error(mensaje));

    return () => { off(); offError(); };
  }, [on]);

  const cargarQuizzes = async () => {
    setCargando(true);
    try {
      const data = await quizzesAPI.getAll(usuario.id);
      setQuizzes(data);
    } catch {
      toast.error('Error al cargar cuestionarios');
    } finally {
      setCargando(false);
    }
  };

  const eliminarQuiz = async (id) => {
    if (!confirm('¿Eliminar este cuestionario?')) return;
    try {
      await quizzesAPI.delete(id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      toast.success('Cuestionario eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const iniciarSala = (quizId) => {
    emit('crear-sala', { quizId, docenteId: usuario.id, docenteNombre: usuario.nombre });
  };

  const irASalaEspera = () => {
    setModalQR(false);
    navigate('/sala-espera');
  };

  const handleLogout = () => {
    resetGame();
    logout();
    navigate('/');
  };

  const urlUnirse = salaActiva ? `${window.location.origin}/unirse?codigo=${salaActiva.codigo}` : '';

  return (
    <div className="min-h-screen">
      {/* ── Navbar ── */}
      <nav className="glass border-b border-purple-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <span className="font-display font-black text-white text-xs">悟</span>
          </div>
          <span className="font-display font-bold text-lg gradient-text">SATORI</span>
        </div>

        <div className="flex items-center gap-3">
          <img src={usuario.avatar} alt={usuario.nombre}
            className="w-9 h-9 rounded-full border-2 border-purple-500/50" />
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-white">{usuario.nombre}</div>
            <div className="text-xs text-gray-400">Docente</div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline text-sm px-3 py-1.5">Salir</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Cuestionarios', valor: quizzes.length, icon: '📋', color: '#a855f7' },
            { label: 'Preguntas Totales', valor: quizzes.reduce((acc, q) => acc + (q.preguntas?.length || 0), 0), icon: '❓', color: '#06b6d4' },
            { label: 'Banco de Preguntas', valor: '35+', icon: '🗃️', color: '#10b981' },
            { label: 'Partidas Jugadas', valor: '—', icon: '🏆', color: '#f59e0b' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }}
              className="card p-4 text-center"
              style={{ borderColor: `${s.color}33` }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.valor}</div>
              <div className="text-gray-400 text-xs">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Acciones rápidas ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <button onClick={() => navigate('/crear-quiz')} className="btn btn-primary">
            ➕ Nuevo Cuestionario
          </button>
          <button onClick={() => navigate('/banco')} className="btn btn-cyan">
            🗃️ Banco de Preguntas
          </button>
          <button onClick={() => navigate('/historial')} className="btn btn-outline">
            📊 Historial de Partidas
          </button>
        </motion.div>

        {/* ── Lista de Cuestionarios ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
            <span className="text-purple-400">📋</span> Mis Cuestionarios
          </h2>

          {cargando ? (
            <div className="text-center py-16 text-gray-500">
              <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
              Cargando...
            </div>
          ) : quizzes.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400 mb-4">Aún no tienes cuestionarios creados</p>
              <button onClick={() => navigate('/crear-quiz')} className="btn btn-primary">
                Crear mi primer cuestionario
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="card flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-white text-sm truncate">{quiz.titulo}</h3>
                      <p className="text-gray-400 text-xs mt-1 truncate">{quiz.descripcion || 'Sin descripción'}</p>
                    </div>
                    <span className="badge badge-purple ml-2 flex-shrink-0">
                      {quiz.preguntas?.length || 0} Qs
                    </span>
                  </div>

                  <div className="flex gap-1 text-xs text-gray-500">
                    <span className="badge badge-cyan">⏱ {quiz.configuracion?.tiempoPorPregunta}s</span>
                    {quiz.configuracion?.mostrarRanking && <span className="badge badge-green">🏆 Ranking</span>}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => iniciarSala(quiz.id)}
                      disabled={quiz.preguntas?.length === 0}
                      className="btn btn-primary flex-1 text-sm py-2"
                      title={quiz.preguntas?.length === 0 ? 'Agrega preguntas primero' : ''}
                    >
                      ▶ Iniciar
                    </button>
                    <button
                      onClick={() => navigate(`/editar-quiz/${quiz.id}`)}
                      className="btn btn-outline text-sm px-3 py-2"
                    >✏️</button>
                    <button
                      onClick={() => eliminarQuiz(quiz.id)}
                      className="btn btn-danger text-sm px-3 py-2"
                    >🗑️</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Modal QR ── */}
      {modalQR && salaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card max-w-sm w-full text-center p-8"
          >
            <h3 className="font-display font-bold text-xl gradient-text mb-2">¡Sala Lista!</h3>
            <p className="text-gray-400 text-sm mb-6">Comparte el código o QR con tus estudiantes</p>

            {/* Código */}
            <div className="glass rounded-2xl p-4 mb-4">
              <div className="text-gray-400 text-xs mb-1">CÓDIGO DE SALA</div>
              <div className="font-display font-black text-5xl gradient-text glow-purple tracking-widest">
                {salaActiva.codigo}
              </div>
            </div>

            {/* QR */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white rounded-2xl">
                <QRCodeSVG value={urlUnirse} size={160} level="M" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setModalQR(false)} className="btn btn-outline flex-1">
                Cerrar
              </button>
              <button onClick={irASalaEspera} className="btn btn-primary flex-1">
                🚀 Ir a Sala de Espera
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
