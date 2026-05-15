// =============================================
// SATORI - App Principal con React Router
// Define todas las rutas de la aplicación
// =============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import NetworkBackground from './components/ui/NetworkBackground';

// Páginas
import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateQuiz       from './pages/CreateQuiz';
import QuestionBank     from './pages/QuestionBank';
import JoinGame         from './pages/JoinGame';
import WaitingRoom      from './pages/WaitingRoom';
import QuestionScreen   from './pages/QuestionScreen';
import RankingScreen    from './pages/RankingScreen';
import PodiumScreen     from './pages/PodiumScreen';
import GameHistory      from './pages/GameHistory';

// Guard para rutas protegidas
function PrivateRoute({ children, rolRequerido }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario.rol !== rolRequerido) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"          element={<LandingPage />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/registro"  element={<RegisterPage />} />
      <Route path="/unirse"    element={<JoinGame />} />

      {/* Juego (accesibles durante partida) */}
      <Route path="/sala-espera"  element={<WaitingRoom />} />
      <Route path="/pregunta"     element={<QuestionScreen />} />
      <Route path="/ranking"      element={<RankingScreen />} />
      <Route path="/podio"        element={<PodiumScreen />} />

      {/* Docente */}
      <Route path="/dashboard"    element={<PrivateRoute rolRequerido="docente"><TeacherDashboard /></PrivateRoute>} />
      <Route path="/crear-quiz"   element={<PrivateRoute rolRequerido="docente"><CreateQuiz /></PrivateRoute>} />
      <Route path="/editar-quiz/:id" element={<PrivateRoute rolRequerido="docente"><CreateQuiz /></PrivateRoute>} />
      <Route path="/banco"        element={<PrivateRoute rolRequerido="docente"><QuestionBank /></PrivateRoute>} />
      <Route path="/historial"    element={<PrivateRoute rolRequerido="docente"><GameHistory /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <NetworkBackground />
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15,15,35,0.95)',
                color: '#e2e8f0',
                border: '1px solid rgba(168,85,247,0.4)',
                backdropFilter: 'blur(16px)',
                fontFamily: "'Inter', sans-serif",
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
