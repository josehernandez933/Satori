// =============================================
// SATORI - Hook de Temporizador
// Cuenta regresiva con callbacks
// =============================================

import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ duracion = 30, onTick, onComplete, autoStart = false } = {}) {
  const [tiempoRestante, setTiempoRestante] = useState(duracion);
  const [corriendo, setCorriendo]           = useState(autoStart);
  const intervalRef                          = useRef(null);
  const inicioRef                            = useRef(null);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Lógica del temporizador
  useEffect(() => {
    if (!corriendo) {
      clearInterval(intervalRef.current);
      return;
    }

    inicioRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        const nuevo = prev - 1;
        onTick?.(nuevo);

        if (nuevo <= 0) {
          clearInterval(intervalRef.current);
          setCorriendo(false);
          onComplete?.();
          return 0;
        }
        return nuevo;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [corriendo]);

  const iniciar = useCallback((nuevaDuracion) => {
    if (nuevaDuracion !== undefined) setTiempoRestante(nuevaDuracion);
    setCorriendo(true);
  }, []);

  const pausar  = useCallback(() => setCorriendo(false), []);
  const resetear = useCallback((nuevaDuracion = duracion) => {
    clearInterval(intervalRef.current);
    setCorriendo(false);
    setTiempoRestante(nuevaDuracion);
  }, [duracion]);

  // Tiempo transcurrido desde el inicio
  const tiempoTranscurrido = () => {
    if (!inicioRef.current) return 0;
    return Math.round((Date.now() - inicioRef.current) / 1000);
  };

  // Porcentaje restante (para animación del ring)
  const porcentaje = tiempoRestante / duracion;

  return { tiempoRestante, corriendo, porcentaje, iniciar, pausar, resetear, tiempoTranscurrido };
}
