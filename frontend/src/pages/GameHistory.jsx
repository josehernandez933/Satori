// =============================================
// SATORI - Historial de Partidas
// Lista de sesiones previas del docente
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { gamesAPI } from '../services/api';

export default function GameHistory() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [partidas, setPartidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    gamesAPI.getAll(usuario.id)
      .then(setPartidas)
      .catch(() => toast.error('Error al cargar historial'))
      .finally(() => setCargando(false));
  }, []);

  const formatFecha = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const eliminarPartida = (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta partida del historial?')) return;
    
    gamesAPI.delete(id)
      .then(() => {
        setPartidas(prev => prev.filter(p => p.id !== id));
        setSeleccionada(null);
        toast.success('Partida eliminada del historial 🧹');
      })
      .catch(() => toast.error('Error al eliminar la partida'));
  };

  return (
    <div className="min-h-screen">
      <div className="glass border-b border-purple-500/20 px-6 py-4 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate('/dashboard')} className="btn btn-outline text-sm px-3 py-1.5">← Volver</button>
        <h1 className="font-display font-bold text-lg gradient-text">📊 Historial de Partidas</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {cargando ? (
          <div className="text-center py-16 text-gray-500">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            Cargando historial...
          </div>
        ) : partidas.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-gray-400">Aún no has jugado ninguna partida</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-4">Ir al Dashboard</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-gray-500 text-sm">{partidas.length} partidas registradas</p>
            {partidas.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card cursor-pointer"
                onClick={() => setSeleccionada(seleccionada?.id === p.id ? null : p)}
                style={{ borderColor: seleccionada?.id === p.id ? 'rgba(168,85,247,0.5)' : undefined }}
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7c3aed33, #06b6d433)' }}>
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-white text-sm truncate">{p.quizTitulo}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">{formatFecha(p.finalizadoEn)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center hidden sm:block">
                      <div className="font-display font-bold text-purple-400">{p.jugadores}</div>
                      <div className="text-gray-500 text-xs">jugadores</div>
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className="font-display font-bold text-cyan-400">{p.totalPreguntas}</div>
                      <div className="text-gray-500 text-xs">preguntas</div>
                    </div>
                    {p.podio?.[0] && (
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold text-sm">👑 {p.podio[0].nombre}</div>
                        <div className="text-gray-500 text-xs">{p.podio[0].puntos?.toLocaleString()} pts</div>
                      </div>
                    )}
                    <span className="text-gray-500 text-sm">{seleccionada?.id === p.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Detalle expandido */}
                {seleccionada?.id === p.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-purple-500/20 p-5"
                  >
                    <h4 className="font-display font-semibold text-purple-300 text-xs mb-3">TOP 3 JUGADORES</h4>
                    <div className="flex flex-col gap-2">
                      {p.podio?.map((j, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <span className="text-lg">{['🥇','🥈','🥉'][idx]}</span>
                          <img src={j.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${j.nombre}`}
                            className="w-7 h-7 rounded-full" alt={j.nombre} />
                          <span className="flex-1 font-accent text-sm">{j.nombre}</span>
                          <span className="font-display font-bold text-sm text-yellow-400">
                            {j.puntos?.toLocaleString()} pts
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center gap-3 border-t border-purple-500/10 pt-4">
                      <span className="text-xs text-gray-500">
                        Código de sala: <span className="font-display text-purple-400">{p.codigo}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarPartida(p.id);
                        }}
                        className="btn btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
                        style={{ padding: '0.4rem 0.8rem', minHeight: 'auto' }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
