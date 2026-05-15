// =============================================
// SATORI - Rutas del Banco de Preguntas
// CRUD de preguntas personalizadas
// =============================================

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// GET /api/questions - Obtener todas las preguntas
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { categoria } = req.query;
  let questions = db.get('questions').value();
  if (categoria) {
    questions = questions.filter(q =>
      q.categoria?.toLowerCase().includes(categoria.toLowerCase())
    );
  }
  res.json(questions);
});

// POST /api/questions - Agregar pregunta personalizada
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { pregunta, opciones, correcta, retroalimentacion, categoria } = req.body;

  if (!pregunta || !opciones || !correcta) {
    return res.status(400).json({ error: 'Pregunta, opciones y respuesta correcta son requeridas' });
  }

  if (!opciones.a || !opciones.b || !opciones.c || !opciones.d) {
    return res.status(400).json({ error: 'Deben existir las opciones a, b, c y d' });
  }

  const nuevaPregunta = {
    id: uuidv4(),
    categoria: categoria || 'Personalizada',
    pregunta,
    opciones,
    correcta,
    retroalimentacion: retroalimentacion || '',
    esPersonalizada: true,
    creadoEn: new Date().toISOString()
  };

  db.get('questions').push(nuevaPregunta).write();
  res.status(201).json(nuevaPregunta);
});

// PUT /api/questions/:id - Editar pregunta
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const pregunta = db.get('questions').find({ id: req.params.id }).value();
  if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });

  const actualizada = { ...pregunta, ...req.body, id: pregunta.id };
  db.get('questions').find({ id: req.params.id }).assign(actualizada).write();
  res.json(actualizada);
});

// DELETE /api/questions/:id - Eliminar pregunta
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const pregunta = db.get('questions').find({ id: req.params.id }).value();
  if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });

  // Solo se pueden eliminar preguntas personalizadas
  if (!pregunta.esPersonalizada) {
    return res.status(403).json({ error: 'No se pueden eliminar preguntas predeterminadas' });
  }

  db.get('questions').remove({ id: req.params.id }).write();
  res.json({ mensaje: 'Pregunta eliminada exitosamente' });
});

module.exports = router;
