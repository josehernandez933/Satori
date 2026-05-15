// =============================================
// SATORI - Pantalla Unirse a Partida
// Estudiantes entran con código o QR
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

const AVATARES = [
  'ninja', 'samurai', 'robot', 'alien', 'dragon', 'phoenix',
  'kuma', 'satori', 'pixel', 'cyber', 'neon', 'ghost'
];

export default function JoinGame() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { emit, on } = useSocket();
  const { setJugador, setSala, setJugadores, setEstado } = useGame();
  const { playJoin } = useSound();

  const [codigo, setCodigo]   = useState(searchParams.get('codigo') || '');
  const [nombre, setNombre]   = useState('');
  const [avatar, setAvatar]   = useState(AVATARES[0]);
  const [cargando, setCargando] = useState(false);
  const [paso, setPaso]       = useState(1); // 1=codigo, 2=nombre/avatar

  // Escuchar respuestas del servidor
  useEffect(() => {
    const offUnido = on('unido-sala', ({ sala, jugador }) => {
      setSala(sala);
      setJugador(jugador);
      setEstado('esperando');
      setCargando(false);
      playJoin();
      toast.success(`¡Conectado a la sala! 🎮`);
      navigate('/sala-espera');
    });

    const offError = on('error-sala', ({ mensaje }) => {
      setCargando(false);
      toast.error(mensaje);
    });

    return () => { offUnido(); offError(); };
  }, [on]);

  const validarCodigo = () => {
    if (codigo.trim().length < 4) return toast.error('Ingresa un código válido');
    setPaso(2);
  };

  const unirse = () => {
    if (!nombre.trim()) return toast.error('Ingresa tu nombre de jugador');
    if (nombre.trim().length > 20) return toast.error('Nombre muy largo (máx 20 caracteres)');
    setCargando(true);
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatar}`;
    emit('unirse-sala', {
      codigo: codigo.trim().toUpperCase(),
      nombreJugador: nombre.trim(),
      avatar: avatarUrl
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Glow fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(80px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-4xl gradient-text glow-purple">SATORI</h1>
          <p className="text-gray-500 text-sm mt-1 font-accent tracking-widest">UNIRSE A PARTIDA</p>
        </div>

        <div className="card p-7">
          {/* Paso 1: Código */}
          {paso === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display font-bold text-lg text-white text-center mb-6">
                Ingresa el Código
              </h2>

              <div className="mb-4">
                <input
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && validarCodigo()}
                  placeholder="Ej: ABC123"
                  maxLength={8}
                  className="input text-center text-3xl font-display font-bold tracking-widest py-4"
                  style={{ letterSpacing: '0.3em' }}
                  autoFocus
                />
                <p className="text-gray-500 text-xs text-center mt-2">
                  Código de 6 caracteres que te dio el docente
                </p>
              </div>

              <button onClick={validarCodigo} className="btn btn-primary w-full py-3 text-base mt-2">
                Continuar →
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.2)' }} />
                <span className="text-gray-500 text-xs">o</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.2)' }} />
              </div>

              <p className="text-center text-gray-500 text-sm">
                Escanea el QR que muestra el docente para entrar automáticamente
              </p>

              <div className="mt-4 text-center">
                <button onClick={() => navigate('/login')} className="text-purple-400 text-sm hover:text-purple-300">
                  ¿Eres docente? Inicia sesión
                </button>
              </div>
            </motion.div>
          )}

          {/* Paso 2: Nombre y Avatar */}
          {paso === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setPaso(1)} className="text-gray-400 hover:text-white">←</button>
                <h2 className="font-display font-bold text-base text-white">Tu Perfil de Jugador</h2>
              </div>

              {/* Código confirmado */}
              <div className="glass rounded-xl p-3 text-center mb-5">
                <span className="text-gray-400 text-xs">SALA</span>
                <div className="font-display font-black text-2xl gradient-text">{codigo}</div>
              </div>

              {/* Nombre */}
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-1">Tu nombre de jugador</label>
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && unirse()}
                  placeholder="Ej: NinjaRed"
                  maxLength={20}
                  className="input text-center font-accent font-semibold text-lg"
                  autoFocus
                />
              </div>

              {/* Selector de Avatar */}
              <div className="mb-5">
                <label className="block text-gray-400 text-sm mb-2">Elige tu avatar</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARES.map(av => (
                    <button
                      key={av} type="button"
                      onClick={() => setAvatar(av)}
                      className="rounded-xl overflow-hidden transition-all"
                      style={{
                        border: avatar === av ? '2px solid #a855f7' : '2px solid transparent',
                        boxShadow: avatar === av ? '0 0 10px rgba(168,85,247,0.5)' : 'none',
                        transform: avatar === av ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${av}`}
                        alt={av}
                        className="w-full"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {nombre && (
                <div className="flex items-center gap-3 glass rounded-xl p-3 mb-4">
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatar}`}
                    className="w-10 h-10 rounded-full border border-purple-500/40" alt="avatar" />
                  <span className="font-accent font-bold text-white">{nombre}</span>
                  <span className="badge badge-cyan ml-auto">Listo</span>
                </div>
              )}

              <button
                onClick={unirse}
                disabled={cargando || !nombre.trim()}
                className="btn btn-primary w-full py-3 text-base"
              >
                {cargando
                  ? <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Conectando...
                    </span>
                  : '🎮 ¡Entrar a la Sala!'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
