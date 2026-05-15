// =============================================
// SATORI - Pantalla de Pregunta
// Timer, 4 botones, puntaje por velocidad
// =============================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import { useSound } from '../hooks/useSound';
import { useAuth } from '../context/AuthContext';
import Timer from '../components/ui/Timer';
import AnswerButton from '../components/game/AnswerButton';

export default function QuestionScreen() {
  const navigate = useNavigate();
  const { sala, jugador, preguntaActual, setPreguntaActual, setResultadoPregunta, setEstado, setRankingActual, actualizarPodio, setRespuestaSeleccionada } = useGame();
  const { emit, on } = useSocket();
  const { playCorrect, playWrong, playTick, playTickUrgent } = useSound();
  const { usuario } = useAuth();
  const esDocente = usuario?.rol === 'docente';

  const [respuestaElegida, setRespuestaElegida]   = useState(null);
  const [respondio, setRespondio]                 = useState(false);
  const [tiempoRestante, setTiempoRestante]       = useState(30);
  const [tiempoAgotado, setTiempoAgotado]         = useState(false);
  const [mostrarResultado, setMostrarResultado]   = useState(false);
  const [confirmacion, setConfirmacion]           = useState(null); // { esCorrecta, puntos }
  const [preguntaData, setPreguntaData]           = useState(preguntaActual);
  const tiempoInicioRef = useRef(Date.now());
  const intervalRef     = useRef(null);

  // Limpiar al desmontar
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Escuchar nueva-pregunta
  useEffect(() => {
    const offNueva = on('nueva-pregunta', (datos) => {
      // Resetear estado para nueva pregunta
      setRespuestaElegida(null);
      setRespondio(false);
      setTiempoAgotado(false);
      setMostrarResultado(false);
      setConfirmacion(null);
      setPreguntaActual(datos);
      setPreguntaData(datos);
      tiempoInicioRef.current = Date.now();
      iniciarTimer(datos.tiempoLimite);
    });

    const offResultado = on('resultado-pregunta', (datos) => {
      clearInterval(intervalRef.current);
      setResultadoPregunta(datos);
      setRankingActual(datos.ranking);
      setMostrarResultado(true);
      setEstado('resultado');
      // Navegar a ranking tras 5 segundos
      setTimeout(() => navigate('/ranking'), 5500);
    });

    const offFinalizada = on('partida-finalizada', ({ podio, rankingFinal }) => {
      clearInterval(intervalRef.current);
      actualizarPodio(podio, rankingFinal);
      navigate('/podio');
    });

    return () => { offNueva(); offResultado(); offFinalizada(); };
  }, [on]);

  // Iniciar timer al montar
  useEffect(() => {
    if (preguntaData) {
      tiempoInicioRef.current = Date.now();
      iniciarTimer(preguntaData.tiempoLimite || 30);
    }
  }, []);

  const iniciarTimer = (duracion) => {
    clearInterval(intervalRef.current);
    setTiempoRestante(duracion);
    let restante = duracion;

    intervalRef.current = setInterval(() => {
      restante--;
      setTiempoRestante(restante);

      if (restante <= 5 && restante > 0) playTickUrgent();
      else if (restante > 5) playTick();

      if (restante <= 0) {
        clearInterval(intervalRef.current);
        setTiempoAgotado(true);
      }
    }, 1000);
  };

  const responder = (letra) => {
    if (respondio || tiempoAgotado || mostrarResultado) return;

    const tiempoRespuesta = Math.round((Date.now() - tiempoInicioRef.current) / 1000);
    clearInterval(intervalRef.current);

    setRespuestaElegida(letra);
    setRespuestaSeleccionada(letra);
    setRespondio(true);

    emit('responder', {
      codigo: sala.codigo,
      respuesta: letra,
      tiempoRespuesta
    });
  };

  // Escuchar confirmación de respuesta del servidor
  useEffect(() => {
    const off = on('respuesta-confirmada', ({ esCorrecta, puntos }) => {
      setConfirmacion({ esCorrecta, puntos });
    });
    return off;
  }, [on]);

  if (!preguntaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          Cargando pregunta...
        </div>
      </div>
    );
  }

  const duracion = preguntaData.tiempoLimite || 30;
  const porcentaje = tiempoRestante / duracion;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Barra de progreso superior (Segmented Tech Meter) ── */}
      <div className="w-full flex h-2 gap-1 px-1 bg-slate-900/80 mt-1">
        {Array.from({ length: preguntaData.totalPreguntas }).map((_, i) => (
          <div 
            key={i} 
            className="flex-1 rounded-sm transition-all duration-300"
            style={{ 
              background: i < preguntaData.preguntaIdx 
                ? '#10b981' 
                : i === preguntaData.preguntaIdx 
                  ? '#06b6d4' 
                  : 'rgba(255,255,255,0.1)',
              boxShadow: i === preguntaData.preguntaIdx ? '0 0 10px #06b6d4' : 'none',
              opacity: i <= preguntaData.preguntaIdx ? 1 : 0.3
            }} 
          />
        ))}
      </div>

      {/* ── Header con info ── */}
      <div className="glass border-b border-purple-500/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="badge badge-purple font-display text-sm">
            {preguntaData.preguntaIdx + 1} / {preguntaData.totalPreguntas}
          </span>
          {preguntaData.categoria && (
            <span className="badge badge-cyan text-xs hidden sm:inline">{preguntaData.categoria}</span>
          )}
        </div>

        {jugador && (
          <div className="flex items-center gap-2">
            <img src={jugador.avatar} alt="tu avatar" className="w-7 h-7 rounded-full border border-purple-500/40" />
            <span className="text-gray-300 text-sm font-accent">{jugador.nombre}</span>
          </div>
        )}
      </div>

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 max-w-3xl mx-auto w-full">

        {/* Timer + Pregunta */}
        <div className="w-full flex flex-col items-center gap-6 mb-6">
          {/* Timer circular */}
          <Timer
            tiempoRestante={tiempoRestante}
            duracion={duracion}
            size={120}
          />

          {/* Enunciado HUD */}
          <motion.div
            key={preguntaData.preguntaIdx}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="relative w-full text-center p-8 md:p-10 bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 overflow-hidden"
            style={{
              boxShadow: '0 0 40px rgba(6,182,212,0.15), inset 0 0 20px rgba(6,182,212,0.05)',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' // Cyberpunk cut corners
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 opacity-50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 opacity-50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-50" />
            
            {/* Tech Scanline Effect */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-1 bg-cyan-400/30 z-10 pointer-events-none"
              animate={{ y: [0, 300, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <h2 className="font-display text-cyan-400 text-xs tracking-[0.3em] mb-4 uppercase opacity-70">
              Decodificando Pregunta
            </h2>
            
            <p className="relative z-20 text-white text-xl md:text-2xl font-bold leading-relaxed tracking-wide font-accent glow-blue" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
              {preguntaData.pregunta}
            </p>
            
            {/* Fake data streams in background of card */}
            <div className="absolute -z-10 inset-0 opacity-10 pointer-events-none flex flex-wrap gap-1 overflow-hidden content-start p-2">
                {Array.from({length: 150}).map((_, i) => <span key={i} className="text-[10px] text-cyan-500 font-mono leading-none">{Math.random() > 0.5 ? '1' : '0'}</span>)}
            </div>
          </motion.div>
        </div>

        {/* ── Botones de respuesta ── */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['a', 'b', 'c', 'd'].map((letra) => (
            <AnswerButton
              key={letra}
              letra={letra}
              texto={preguntaData.opciones[letra]}
              onClick={responder}
              seleccionada={respuestaElegida === letra}
              deshabilitada={esDocente || respondio || tiempoAgotado || mostrarResultado}
            />
          ))}
        </div>

        {/* ── Acciones exclusivas del docente ── */}
        {esDocente && !tiempoAgotado && !mostrarResultado && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full text-center">
            <button 
              onClick={() => emit('forzar-resultados', { codigo: sala.codigo })}
              className="btn btn-outline text-sm"
              style={{ color: '#22d3ee', borderColor: 'rgba(6,182,212,0.5)' }}
            >
              ⏭️ Continuar / Finalizar Tiempo
            </button>
            <p className="text-gray-500 text-xs mt-2">Los estudiantes aún pueden responder hasta que termine el tiempo o presiones continuar.</p>
          </motion.div>
        )}

        {/* ── Estado: Respondió / Tiempo agotado (Para estudiantes) ── */}
        <AnimatePresence>
          {!esDocente && (respondio || tiempoAgotado) && !mostrarResultado && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              {tiempoAgotado && !respondio ? (
                <div className="badge badge-purple text-sm px-4 py-2">
                  ⏰ ¡Tiempo agotado! Esperando resultado...
                </div>
              ) : confirmacion ? (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className={`text-center p-3 rounded-xl ${confirmacion.esCorrecta ? 'text-green-400' : 'text-red-400'}`}
                >
                  <div className="text-3xl mb-1">{confirmacion.esCorrecta ? '✅' : '❌'}</div>
                  <div className="font-display font-bold text-lg">
                    {confirmacion.esCorrecta ? `+${confirmacion.puntos} pts` : '0 pts'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Esperando resultado de todos...</div>
                </motion.div>
              ) : (
                <div className="badge badge-cyan text-sm px-4 py-2 animate-pulse">
                  ✓ Respuesta enviada — esperando...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
