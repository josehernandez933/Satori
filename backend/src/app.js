// =============================================
// SATORI - Servidor Principal
// Express + Socket.io + LowDB
// =============================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const networkQuestions = require('./data/networkQuestions');

// --- Inicializar base de datos LowDB ---
const adapter = new FileSync(path.join(__dirname, '../db.json'));
const db = low(adapter);

// Estructura inicial de la base de datos
db.defaults({
  users: [],
  quizzes: [],
  games: [],
  questions: networkQuestions   // Cargar banco de preguntas predeterminado
}).write();

// --- Configurar Express ---
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Compartir db con rutas via app.locals
app.locals.db = db;

// --- Rutas API ---
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const gameRoutes = require('./routes/games');
const questionsRoutes = require('./routes/questions');

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/questions', questionsRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SATORI Backend activo 🚀', time: new Date() });
});

// --- Socket.io ---
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Inicializar lógica de juego con Socket.io
require('./sockets/gameSocket')(io, db);

// --- Iniciar servidor ---
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 SATORI Backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 Socket.io listo para conexiones en tiempo real`);
  console.log(`🗄️  Base de datos: db.json`);
  console.log(`❓ Preguntas cargadas: ${db.get('questions').value().length}\n`);
});

module.exports = { app, server };
