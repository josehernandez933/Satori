const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const quizSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, default: '' },
  docenteId: { type: String, required: true },
  preguntas: [
    {
      pregunta: {
        type: String,
        required: true
      },

      opciones: {
        a: { type: String, required: true },
        b: { type: String, required: true },
        c: { type: String, required: true },
        d: { type: String, required: true }
      },

      correcta: {
        type: String,
        required: true
      },

      retroalimentacion: {
        type: String,
        default: ''
      },

      categoria: {
        type: String,
        default: ''
      }
    }
  ],// Array de IDs de preguntas
  configuracion: {
    tiempoPorPregunta: { type: Number, default: 30 },
    mostrarRanking: { type: Boolean, default: true },
    sonidos: { type: Boolean, default: true }
  },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
});

// Actualizar la fecha de modificado antes de guardar
quizSchema.pre('save', function (next) {
  this.actualizadoEn = Date.now();
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
