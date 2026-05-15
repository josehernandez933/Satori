// =============================================
// SATORI - Hook de Sonidos
// Genera sonidos con Web Audio API (sin archivos externos)
// =============================================

import { useRef, useCallback } from 'react';

export function useSound() {
  const audioCtxRef = useRef(null);

  // Obtener o crear contexto de audio
  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  // Función genérica para reproducir un tono
  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.3) => {
    try {
      const ctx = getCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Silenciar si el navegador no soporta Web Audio
    }
  }, []);

  // 🎵 Sonido correcto (acorde mayor ascendente)
  const playCorrect = useCallback(() => {
    playTone(523, 0.15, 'sine', 0.25);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.3), 200);
  }, [playTone]);

  // 🔴 Sonido incorrecto (tono descendente)
  const playWrong = useCallback(() => {
    playTone(300, 0.1, 'sawtooth', 0.2);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.2), 120);
  }, [playTone]);

  // ⏰ Tick del temporizador
  const playTick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.1);
  }, [playTone]);

  // ⚡ Tick urgente (últimos 5 segundos)
  const playTickUrgent = useCallback(() => {
    playTone(1000, 0.08, 'square', 0.15);
  }, [playTone]);

  // 🏆 Fanfarria del podio
  const playPodium = useCallback(() => {
    const notas = [523, 659, 784, 1047];
    notas.forEach((nota, i) => {
      setTimeout(() => playTone(nota, 0.3, 'sine', 0.3), i * 150);
    });
    setTimeout(() => {
      playTone(784, 0.2, 'sine', 0.2);
      setTimeout(() => playTone(1047, 0.6, 'sine', 0.35), 100);
    }, 700);
  }, [playTone]);

  // 🔔 Sonido de nuevo jugador
  const playJoin = useCallback(() => {
    playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(800, 0.2, 'sine', 0.2), 100);
  }, [playTone]);

  // 🚀 Sonido de inicio de partida
  const playStart = useCallback(() => {
    [300, 400, 500, 700].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, 'square', 0.2), i * 120);
    });
  }, [playTone]);

  return { playCorrect, playWrong, playTick, playTickUrgent, playPodium, playJoin, playStart };
}
