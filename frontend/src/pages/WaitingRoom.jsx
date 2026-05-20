// =============================================
// SATORI - Sala de Espera
// Vista tanto para docente como estudiantes
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import { useSound } from '../hooks/useSound';

export default function WaitingRoom() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { sala, jugador, jugadores, setJugadores, setEstado, setPreguntaActual, resetGame } = useGame();
  const { emit, on } = useSocket();
  const { playJoin, playStart } = useSound();

  const [cuenta, setCuenta]           = useState(null); // null | 3 | 2 | 1 | 'GO!'
  const esDocente = usuario?.rol === 'docente';

  // Redirigir si no hay sala
  useEffect(() => {
    if (!sala && !jugador) {
      navigate(esDocente ? '/dashboard' : '/unirse');
    }
  }, []);

  // Socket listeners
  useEffect(() => {
    const offJugador = on('jugador-unido', ({ jugadores: lista }) => {
      setJugadores(lista);
      playJoin();
    });

    const offIniciando = on('partida-iniciando', ({ cuenta: c }) => {
      playStart();
      // Cuenta regresiva 3, 2, 1, ¡GO!
      let n = c;
      setCuenta(n);
      const interval = setInterval(() => {
        n--;
        if (n > 0) setCuenta(n);
        else {
          setCuenta('¡GO!');
          setTimeout(() => {
            clearInterval(interval);
            setEstado('jugando');
            navigate('/pregunta');
          }, 800);
        }
      }, 1000);
    });

    const offNuevaPregunta = on('nueva-pregunta', (datos) => {
      setPreguntaActual(datos);
      setEstado('jugando');
      navigate('/pregunta');
    });

    const offDesconectado = on('jugador-desconectado', ({ jugadores: lista }) => {
      setJugadores(lista.filter(j => j.conectado));
    });

    return () => { offJugador(); offIniciando(); offNuevaPregunta(); offDesconectado(); };
  }, [on]);

  const iniciarPartida = () => {
    if (jugadores.length === 0) {
      toast.error('Espera que se conecten jugadores');
      return;
    }
    emit('iniciar-partida', { codigo: sala.codigo });
  };

  const salir = () => {
    resetGame();
    navigate(esDocente ? '/dashboard' : '/');
  };

  const getUrlUnirse = () => {
    if (!sala) return '';

    // Prioridad 1: URL de producción configurada en variables de entorno (VITE_FRONTEND_URL)
    const envFrontendUrl = import.meta.env.VITE_FRONTEND_URL;
    if (envFrontendUrl) {
      const base = envFrontendUrl.replace(/\/$/, '');
      return `${base}/unirse?codigo=${sala.codigo}`;
    }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const port = window.location.port ? `:${window.location.port}` : '';

    // Evitar usar IPs internas de la nube/Render (ej. que empiezan con 10.x.x.x o 172.16-31.x.x)
    const ipEsInternaNube = sala.ipLocal && (
      sala.ipLocal.startsWith('10.') ||
      sala.ipLocal.startsWith('172.1') ||
      sala.ipLocal.startsWith('172.2') ||
      sala.ipLocal.startsWith('172.3') ||
      sala.ipLocal === '127.0.0.1' ||
      sala.ipLocal === 'localhost'
    );

    // Prioridad 2: Usar sala.ipLocal si estamos en local y es una IP válida para red local (ej: 192.168.x.x)
    // De lo contrario, usar window.location.origin (que apunta al Netlify del docente o a su localhost real)
    const base = (isLocalhost && sala.ipLocal && !ipEsInternaNube) 
      ? `http://${sala.ipLocal}${port}` 
      : window.location.origin;

    return `${base}/unirse?codigo=${sala.codigo}`;
  };
  const urlUnirse = getUrlUnirse();

  if (!sala && !jugador) return null;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fondo animado */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)', animation: 'shimmer 3s linear infinite', backgroundSize: '200% auto' }} />
      </div>

      {/* Header */}
      <div className="glass border-b border-purple-500/20 px-6 py-4 flex items-center justify-between relative z-10">
        <div>
          <h1 className="font-display font-bold text-lg gradient-text">Sala de Espera</h1>
          <p className="text-gray-400 text-xs">{sala?.quiz?.titulo || 'Cuestionario'}</p>
        </div>
        <button onClick={salir} className="btn btn-outline text-sm px-3 py-1.5">Salir</button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto w-full">

        {/* ── Columna izquierda: Código + QR (solo docente) ── */}
        {esDocente && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 flex flex-col gap-4"
          >
            <div className="card p-5 text-center">
              <p className="text-gray-400 text-xs mb-1 font-accent tracking-widest">CÓDIGO DE SALA</p>
              <div className="font-display font-black text-4xl sm:text-5xl gradient-text glow-purple tracking-wider my-2 whitespace-nowrap select-all">
                {sala.codigo}
              </div>
              <p className="text-gray-500 text-xs">Comparte este código con tus estudiantes</p>
            </div>

            <div className="card p-5 flex flex-col items-center gap-3">
              <p className="text-gray-400 text-sm font-accent">Escanear QR</p>
              <div className="p-3 bg-white rounded-xl">
                <QRCodeSVG value={urlUnirse} size={150} level="M" />
              </div>
            </div>

            <button
              onClick={iniciarPartida}
              disabled={jugadores.length === 0}
              className="btn btn-primary w-full py-4 text-lg animate-pulse-glow"
            >
              {jugadores.length === 0 ? '⏳ Esperando jugadores...' : `▶ Iniciar Partida (${jugadores.length})`}
            </button>
          </motion.div>
        )}

        {/* ── Columna derecha: Jugadores conectados ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">
              Jugadores Conectados
              <span className="ml-2 font-accent text-purple-400">({jugadores.length})</span>
            </h2>
          </div>

          {jugadores.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4 animate-pulse">👾</div>
              <p className="text-gray-400">Esperando que los estudiantes se unan...</p>
              {!esDocente && (
                <p className="text-gray-600 text-sm mt-2">Tú ya estás conectado. Espera al docente.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <AnimatePresence>
                {jugadores.filter(j => j.conectado !== false).map((j, i) => (
                  <motion.div
                    key={j.nombre}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 250, delay: i * 0.05 }}
                    className="card p-3 text-center flex flex-col items-center gap-2"
                    style={{
                      borderColor: j.nombre === jugador?.nombre ? 'rgba(168,85,247,0.6)' : undefined,
                      boxShadow: j.nombre === jugador?.nombre ? '0 0 15px rgba(168,85,247,0.2)' : undefined
                    }}
                  >
                    <img
                      src={j.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${j.nombre}`}
                      alt={j.nombre}
                      className="w-14 h-14 rounded-full"
                      style={{ border: '2px solid rgba(168,85,247,0.4)' }}
                    />
                    <span className="font-accent font-semibold text-sm text-white truncate w-full px-1">
                      {j.nombre}
                    </span>
                    {j.nombre === jugador?.nombre && (
                      <span className="badge badge-purple text-xs">Tú</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Mensaje para estudiante */}
          {!esDocente && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="card mt-4 p-4 text-center"
              style={{ borderColor: 'rgba(6,182,212,0.3)' }}
            >
              <div className="text-2xl mb-2 animate-bounce">⚡</div>
              <p className="text-cyan-400 font-accent font-semibold">¡Estás dentro!</p>
              <p className="text-gray-400 text-sm">Espera que el docente inicie la partida</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Overlay cuenta regresiva ── */}
      <AnimatePresence>
        {cuenta !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              key={cuenta}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-center"
            >
              <div className="font-display font-black gradient-text glow-purple"
                style={{ fontSize: cuenta === '¡GO!' ? '5rem' : '10rem', lineHeight: 1 }}>
                {cuenta}
              </div>
              <p className="text-gray-400 mt-4 font-accent text-lg">¡La partida está comenzando!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
