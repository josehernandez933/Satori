// =============================================
// SATORI - Servidor Principal
// Express + Socket.io + MongoDB
// =============================================

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const Question = require('./models/Question');
const networkQuestions = require('./data/networkQuestions');

// --- Inicializar base de datos MongoDB ---
connectDB();

// --- Función para cargar preguntas por defecto si la BD está vacía ---
const seedQuestions = async () => {
  try {
    const count = await Question.countDocuments();
    if (count === 0) {
      console.log('🔄 Inicializando banco de preguntas predeterminado...');
      // Las preguntas en networkQuestions no tienen formato exacto Mongoose, 
      // así que mapeamos si es necesario o las guardamos directamente.
      await Question.insertMany(networkQuestions.map(q => ({
        ...q,
        esPersonalizada: false
      })));
      console.log('✅ Preguntas predeterminadas cargadas.');
    }
  } catch (error) {
    console.error('❌ Error cargando preguntas:', error);
  }
};
seedQuestions();

// --- Configurar Express ---
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

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
require('./sockets/gameSocket')(io);

// --- Iniciar servidor ---
const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`\n🚀 SATORI Backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 Socket.io listo para conexiones en tiempo real\n`);
});

module.exports = { app, server };
