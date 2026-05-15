// =============================================
// SATORI - Lista de Ranking
// Muestra posiciones con animación
// =============================================

import { motion, AnimatePresence } from 'framer-motion';

export default function RankingList({ ranking = [], jugadorActual = null }) {
  const medallas = ['🥇', '🥈', '🥉'];

  return (
    <div className="flex flex-col gap-2 w-full">
      <AnimatePresence>
        {ranking.slice(0, 10).map((jugador, idx) => {
          const esMiPosicion = jugador.nombre === jugadorActual;
          return (
            <motion.div
              key={jugador.nombre}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, type: 'spring', stiffness: 200 }}
              className={`ranking-item ${esMiPosicion ? 'border-purple-500 bg-purple-500/10' : ''}`}
              style={esMiPosicion ? { borderColor: 'rgba(168,85,247,0.6)', boxShadow: '0 0 15px rgba(168,85,247,0.2)' } : {}}
            >
              {/* Posición */}
              <div className="w-8 text-center font-display font-bold text-lg flex-shrink-0">
                {idx < 3
                  ? <span>{medallas[idx]}</span>
                  : <span className="text-gray-400">#{idx + 1}</span>
                }
              </div>

              {/* Avatar */}
              <img
                src={jugador.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${jugador.nombre}`}
                alt={jugador.nombre}
                className="w-9 h-9 rounded-full flex-shrink-0"
                style={{ border: esMiPosicion ? '2px solid #a855f7' : '2px solid rgba(255,255,255,0.1)' }}
              />

              {/* Nombre */}
              <span className={`flex-1 font-accent font-semibold text-base truncate ${esMiPosicion ? 'text-purple-300' : 'text-gray-200'}`}>
                {jugador.nombre}
                {esMiPosicion && <span className="ml-2 text-xs text-purple-400">(tú)</span>}
              </span>

              {/* Puntos */}
              <span className="font-display font-bold text-lg"
                style={{ color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7c2f' : '#a855f7' }}>
                {jugador.puntos.toLocaleString()} pts
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
