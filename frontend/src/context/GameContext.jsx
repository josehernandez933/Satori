// =============================================
// SATORI - Contexto del Juego
// Estado global de la partida en curso
// =============================================

import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Estado de la sala actual
  const [sala, setSala]             = useState(null);
  const [jugador, setJugador]       = useState(null);
  const [jugadores, setJugadores]   = useState([]);
  const [estado, setEstado]         = useState('idle'); // idle | esperando | jugando | resultado | finalizado
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [rankingActual, setRankingActual]   = useState([]);
  const [resultadoPregunta, setResultadoPregunta] = useState(null);
  const [podioFinal, setPodioFinal]             = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante]     = useState(0);

  // Resetear todo el estado del juego
  const resetGame = useCallback(() => {
    setSala(null);
    setJugador(null);
    setJugadores([]);
    setEstado('idle');
    setPreguntaActual(null);
    setRankingActual([]);
    setResultadoPregunta(null);
    setPodioFinal(null);
    setRespuestaSeleccionada(null);
    setTiempoRestante(0);
  }, []);

  const value = {
    sala, setSala,
    jugador, setJugador,
    jugadores, setJugadores,
    estado, setEstado,
    preguntaActual, setPreguntaActual,
    rankingActual, setRankingActual,
    resultadoPregunta, setResultadoPregunta,
    podioFinal, setPodioFinal,
    respuestaSeleccionada, setRespuestaSeleccionada,
    tiempoRestante, setTiempoRestante,
    resetGame,
    // Helper para actualizar podio desde cualquier página
    actualizarPodio: (podio, ranking) => {
      setPodioFinal(podio);
      setRankingActual(ranking);
      setEstado('finalizado');
    }
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame debe usarse dentro de GameProvider');
  return context;
}
