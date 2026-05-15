const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const questionSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  categoria: { type: String, default: 'Personalizada' },
  pregunta: { type: String, required: true },
  opciones: {
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true }
  },
  correcta: { type: String, required: true, enum: ['a', 'b', 'c', 'd'] },
  retroalimentacion: { type: String, default: '' },
  esPersonalizada: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
