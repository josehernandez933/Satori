const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nombre: { type: String, required: true },
  avatar: { type: String },
  puntos: { type: Number, default: 0 },
  respuestasCorrectas: { type: Number, default: 0 },
  estado: { type: String, default: 'activo' }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  pin: { type: String, required: true },
  quizId: { type: String, required: true },
  docenteId: { type: String, required: true },
  jugadores: [playerSchema],
  estado: { type: String, default: 'terminado' }, // 'esperando', 'jugando', 'terminado'
  iniciadoEn: { type: Date, default: Date.now },
  finalizadoEn: { type: Date }
});

module.exports = mongoose.model('Game', gameSchema);
