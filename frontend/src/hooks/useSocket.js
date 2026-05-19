// =============================================
// SATORI - Hook de Socket.io
// Maneja la conexión en tiempo real
// =============================================

import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null; // Singleton para evitar múltiples conexiones

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    // Reutilizar conexión existente o crear nueva
    if (!socketInstance || !socketInstance.connected) {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin;
      socketInstance = io(BACKEND_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }
    socketRef.current = socketInstance;

    return () => {
      // No desconectar al desmontar para mantener la conexión entre páginas
    };
  }, []);

  // Emitir evento al servidor
  const emit = useCallback((evento, datos) => {
    socketRef.current?.emit(evento, datos);
  }, []);

  // Escuchar evento del servidor (se limpia automáticamente)
  const on = useCallback((evento, callback) => {
    socketRef.current?.on(evento, callback);
    return () => socketRef.current?.off(evento, callback);
  }, []);

  // Quitar listener específico
  const off = useCallback((evento, callback) => {
    socketRef.current?.off(evento, callback);
  }, []);

  // Desconectar manualmente
  const disconnect = useCallback(() => {
    socketInstance?.disconnect();
    socketInstance = null;
  }, []);

  return { socket: socketRef.current, emit, on, off, disconnect };
}
