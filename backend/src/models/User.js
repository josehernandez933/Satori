const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // En producción usar bcrypt
  rol: { type: String, required: true, enum: ['docente', 'estudiante'] },
  avatar: { type: String },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
