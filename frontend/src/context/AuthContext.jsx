// =============================================
// SATORI - Contexto de Autenticación
// Maneja sesión del usuario con localStorage
// =============================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al iniciar, recuperar sesión guardada
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('satori_usuario');
    if (sesionGuardada) {
      setUsuario(JSON.parse(sesionGuardada));
    }
    setCargando(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setUsuario(data.usuario);
    localStorage.setItem('satori_usuario', JSON.stringify(data.usuario));
    return data.usuario;
  };

  // Registro
  const registrar = async (nombre, email, password, rol) => {
    const data = await authAPI.register(nombre, email, password, rol);
    setUsuario(data.usuario);
    localStorage.setItem('satori_usuario', JSON.stringify(data.usuario));
    return data.usuario;
  };

  // Logout
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('satori_usuario');
  };

  const value = { usuario, cargando, login, registrar, logout };

  return (
    <AuthContext.Provider value={value}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
