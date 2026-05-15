// =============================================
// SATORI - Pantalla de Podio Final
// TOP 3 animado + confetti + ranking completo
// =============================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../hooks/useSound';
import Podium from '../components/game/Podium';
import RankingList from '../components/game/RankingList';

export default function PodiumScreen() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { podioFinal, rankingActual, jugador, resetGame } = useGame();
  const { playPodium } = useSound();

  useEffect(() => { playPodium(); }, []);

  const salir = () => {
    resetGame();
    navigate(usuario?.rol === 'docente' ? '/dashboard' : '/');
  };

  const podio = podioFinal || rankingActual?.slice(0, 3).map((j, i) => ({ ...j, posicion: i + 1 })) || [];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #fbbf24, #a855f7, transparent)', filter: 'blur(80px)' }} />
      </div>

      <div className="glass border-b border-yellow-500/20 px-6 py-4 flex items-center justify-between relative z-10">
        <h1 className="font-display font-black text-xl gradient-text-gold">🏆 PODIO FINAL</h1>
        <button onClick={salir} className="btn btn-outline text-sm">
          {usuario?.rol === 'docente' ? '→ Dashboard' : '→ Inicio'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-5xl mx-auto w-full relative z-10">
        <div className="flex-1 flex flex-col items-center">
          <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-display font-black text-3xl gradient-text-gold text-center mb-2">
            ¡Felicidades!
          </motion.h2>
          {podio[0] && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-yellow-400 font-accent text-lg mb-4 text-center">
              👑 Ganador: <strong>{podio[0].nombre}</strong> — {podio[0].puntos?.toLocaleString()} pts
            </motion.p>
          )}
          <Podium podio={podio} />
          {jugador && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
              className="card mt-6 p-4 text-center max-w-sm" style={{ borderColor: 'rgba(251,191,36,0.3)' }}>
              <img src={jugador.avatar} alt="tú" className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-yellow-400/50" />
              <p className="text-gray-300 text-sm">
                <span className="text-white font-semibold">{jugador.nombre}</span> — posición{' '}
                <span className="text-yellow-400 font-bold">
                  #{(rankingActual?.findIndex(j => j.nombre === jugador.nombre) ?? -1) + 1 || '?'}
                </span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {rankingActual?.find(j => j.nombre === jugador.nombre)?.puntos?.toLocaleString() || 0} puntos
              </p>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
          className="lg:w-72">
          <div className="card p-5 h-full">
            <h3 className="font-display font-bold text-purple-300 text-sm mb-4">📋 RANKING COMPLETO</h3>
            <RankingList ranking={rankingActual || podio} jugadorActual={jugador?.nombre} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
