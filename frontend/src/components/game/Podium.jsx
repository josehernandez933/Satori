// =============================================
// SATORI - Componente Podio Final
// Animación de entrada TOP 3 con confetti
// =============================================

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const PODIO_CONFIG = [
  { posicion: 1, altura: 'h-36', orden: 1, color: '#fbbf24', sombra: 'rgba(251,191,36,0.5)', escala: 1.1, delay: 0.6, clase: 'podio-1', corona: '👑' },
  { posicion: 2, altura: 'h-24', orden: 0, color: '#94a3b8', sombra: 'rgba(148,163,184,0.4)', escala: 1,   delay: 0.3, clase: 'podio-2', corona: '🥈' },
  { posicion: 3, altura: 'h-16', orden: 2, color: '#cd7c2f', sombra: 'rgba(205,124,47,0.4)',  escala: 0.95,delay: 0.9, clase: 'podio-3', corona: '🥉' },
];

export default function Podium({ podio = [] }) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (podio.length > 0 && !confettiFired.current) {
      confettiFired.current = true;
      // Disparar confetti dorado
      const duration = 4000;
      const end = Date.now() + duration;

      const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#06b6d4', '#fbbf24', '#ec4899'],
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#06b6d4', '#fbbf24', '#ec4899'],
        });
      }, 200);
    }
  }, [podio]);

  if (podio.length === 0) return null;

  // Reordenar: 2do - 1ro - 3ro (visual del podio)
  const orden = [podio[1], podio[0], podio[2]].filter(Boolean);

  return (
    <div className="flex items-end justify-center gap-4 w-full max-w-2xl mx-auto mt-8">
      {orden.map((jugador) => {
        const cfg = PODIO_CONFIG.find(c => c.posicion === jugador.posicion);
        if (!cfg) return null;

        return (
          <motion.div
            key={jugador.nombre}
            className="flex flex-col items-center gap-2"
            style={{ order: cfg.orden }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: cfg.delay, type: 'spring', stiffness: 120, damping: 12 }}
          >
            {/* Corona / medalla */}
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ delay: cfg.delay + 0.5, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              {cfg.corona}
            </motion.span>

            {/* Avatar */}
            <motion.img
              src={jugador.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${jugador.nombre}`}
              alt={jugador.nombre}
              className="rounded-full"
              style={{
                width: cfg.escala * 70,
                height: cfg.escala * 70,
                border: `3px solid ${cfg.color}`,
                boxShadow: `0 0 20px ${cfg.sombra}`,
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: cfg.delay }}
            />

            {/* Nombre */}
            <span className="font-accent font-bold text-center text-sm truncate max-w-[100px]"
              style={{ color: cfg.color }}>
              {jugador.nombre}
            </span>

            {/* Puntos */}
            <span className="font-display font-bold text-xs text-gray-300">
              {jugador.puntos?.toLocaleString()} pts
            </span>

            {/* Base del podio */}
            <div
              className={`w-24 ${cfg.altura} ${cfg.clase} rounded-t-xl flex items-center justify-center font-display font-black text-3xl`}
              style={{ color: cfg.color }}
            >
              {jugador.posicion}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
