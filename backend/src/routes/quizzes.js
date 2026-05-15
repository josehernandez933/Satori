// =============================================
// SATORI - Rutas de Cuestionarios (CRUD)
// =============================================

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// GET /api/quizzes - Obtener todos los cuestionarios del docente
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { docenteId } = req.query;
  let quizzes = db.get('quizzes').value();
  if (docenteId) {
    quizzes = quizzes.filter(q => q.docenteId === docenteId);
  }
  res.json(quizzes);
});

// GET /api/quizzes/:id - Obtener un cuestionario específico
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const quiz = db.get('quizzes').find({ id: req.params.id }).value();
  if (!quiz) return res.status(404).json({ error: 'Cuestionario no encontrado' });
  res.json(quiz);
});

// POST /api/quizzes - Crear cuestionario
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { titulo, descripcion, docenteId, preguntas, configuracion } = req.body;

  if (!titulo || !docenteId) {
    return res.status(400).json({ error: 'Título y docenteId son requeridos' });
  }

  const nuevoQuiz = {
    id: uuidv4(),
    titulo,
    descripcion: descripcion || '',
    docenteId,
    preguntas: preguntas || [],
    configuracion: {
      tiempoPorPregunta: configuracion?.tiempoPorPregunta || 30,
      mostrarRanking: configuracion?.mostrarRanking !== false,
      sonidos: configuracion?.sonidos !== false,
      ...configuracion
    },
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  };

  db.get('quizzes').push(nuevoQuiz).write();
  res.status(201).json(nuevoQuiz);
});

// PUT /api/quizzes/:id - Actualizar cuestionario
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const quiz = db.get('quizzes').find({ id: req.params.id }).value();
  if (!quiz) return res.status(404).json({ error: 'Cuestionario no encontrado' });

  const actualizado = {
    ...quiz,
    ...req.body,
    id: quiz.id,           // No permitir cambiar ID
    docenteId: quiz.docenteId, // No permitir cambiar dueño
    actualizadoEn: new Date().toISOString()
  };

  db.get('quizzes').find({ id: req.params.id }).assign(actualizado).write();
  res.json(actualizado);
});

// DELETE /api/quizzes/:id - Eliminar cuestionario
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const quiz = db.get('quizzes').find({ id: req.params.id }).value();
  if (!quiz) return res.status(404).json({ error: 'Cuestionario no encontrado' });

  db.get('quizzes').remove({ id: req.params.id }).write();
  res.json({ mensaje: 'Cuestionario eliminado exitosamente' });
});

module.exports = router;
