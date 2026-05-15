// =============================================
// SATORI - Pantalla de Resultado por Pregunta
// Retroalimentación + Top 3 + Ranking parcial
// =============================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../hooks/useSound';
import RankingList from '../components/game/RankingList';

export default function RankingScreen() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { sala, resultadoPregunta, rankingActual, jugador, setEstado, setPreguntaActual, respuestaSeleccionada } = useGame();
  const { on, emit } = useSocket();
  const { playCorrect, playWrong } = useSound();
  const esDocente = usuario?.rol === 'docente';

  // Sonido de resultado al cargar la pantalla
  useEffect(() => {
    if (!esDocente && respuestaSeleccionada && resultadoPregunta) {
      if (respuestaSeleccionada === resultadoPregunta.respuestaCorrecta) playCorrect();
      else playWrong();
    }
  }, [resultadoPregunta]);

  // Escuchar siguiente pregunta o fin
  useEffect(() => {
    const offNueva = on('nueva-pregunta', (datos) => {
      setPreguntaActual(datos);
      setEstado('jugando');
      navigate('/pregunta');
    });

    const offFinalizada = on('partida-finalizada', () => {
      navigate('/podio');
    });

    return () => { offNueva(); offFinalizada(); };
  }, [on]);

  if (!resultadoPregunta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
          Cargando resultado...
        </div>
      </div>
    );
  }

  const { respuestaCorrecta, retroalimentacion, porcentajeAcierto, top3Rapidos, ranking } = resultadoPregunta;

  const LETRAS_COLOR = { a: '#7c3aed', b: '#0891b2', c: '#059669', d: '#dc2626' };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass border-b border-purple-500/20 px-6 py-4 flex items-center justify-between">
        <h1 className="font-display font-bold gradient-text">Resultado</h1>
        {esDocente && (
          <button
            onClick={() => emit('siguiente-pregunta', { codigo: sala?.codigo })}
            className="btn btn-primary text-sm"
          >
            Siguiente →
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-5xl mx-auto w-full">

        {/* ── Columna izquierda: Respuesta + Retroalimentación ── */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Respuesta correcta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-5 text-center"
            style={{ borderColor: '#10b981', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
          >
            <p className="text-gray-400 text-xs mb-2 font-accent tracking-widest">RESPUESTA CORRECTA</p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-xl text-white"
                style={{ background: LETRAS_COLOR[respuestaCorrecta] }}
              >
                {respuestaCorrecta?.toUpperCase()}
              </div>
              <div className="text-green-400 font-bold text-xl">✅ Correcta</div>
            </div>
          </motion.div>

          {/* Retroalimentación */}
          {retroalimentacion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-5"
              style={{ borderColor: 'rgba(6,182,212,0.4)' }}
            >
              <p className="text-cyan-400 text-xs mb-2 font-accent tracking-widest">💡 RETROALIMENTACIÓN</p>
              <p className="text-gray-200 text-sm leading-relaxed">{retroalimentacion}</p>
            </motion.div>
          )}

          {/* Estadística de aciertos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-5 text-center"
          >
            <p className="text-gray-400 text-xs mb-2 font-accent">ACIERTOS DEL GRUPO</p>
            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="font-display font-black text-5xl gradient-text">{porcentajeAcierto}%</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-2 rounded-full"
                style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
                initial={{ width: 0 }}
                animate={{ width: `${porcentajeAcierto}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-1">de estudiantes respondió correctamente</p>
          </motion.div>

          {/* Top 3 más rápidos */}
          {top3Rapidos?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-5"
            >
              <p className="text-yellow-400 text-xs mb-3 font-accent tracking-widest">⚡ MÁS RÁPIDOS Y CORRECTOS</p>
              <div className="flex flex-col gap-2">
                {top3Rapidos.map((j, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span className="text-xl">{['🥇','🥈','🥉'][i]}</span>
                    <img src={j.avatar} alt={j.nombre} className="w-7 h-7 rounded-full" />
                    <span className="flex-1 font-accent font-semibold text-sm">{j.nombre}</span>
                    <span className="text-yellow-400 font-bold text-sm">+{j.puntos} pts</span>
                    <span className="text-gray-500 text-xs">{j.tiempo}s</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Columna derecha: Ranking ── */}
        <div className="lg:w-72 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5 flex-1"
          >
            <h2 className="font-display font-bold text-purple-300 text-sm mb-4">🏆 RANKING ACTUAL</h2>
            <RankingList ranking={ranking || rankingActual} jugadorActual={jugador?.nombre} />
          </motion.div>

          {/* Esperando... */}
          {!esDocente && (
            <div className="card p-4 text-center">
              <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-xs">Esperando siguiente pregunta...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
