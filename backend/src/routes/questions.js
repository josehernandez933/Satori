// =============================================
// SATORI - Rutas del Banco de Preguntas
// CRUD de preguntas personalizadas con Mongoose
// =============================================

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions - Obtener todas las preguntas
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    let query = {};
    if (categoria) {
      // Búsqueda case-insensitive
      query.categoria = { $regex: new RegExp(categoria, 'i') };
    }
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    console.error('Error obteniendo preguntas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/questions - Agregar pregunta personalizada
router.post('/', async (req, res) => {
  try {
    const { pregunta, opciones, correcta, retroalimentacion, categoria } = req.body;

    if (!pregunta || !opciones || !correcta) {
      return res.status(400).json({ error: 'Pregunta, opciones y respuesta correcta son requeridas' });
    }

    if (!opciones.a || !opciones.b || !opciones.c || !opciones.d) {
      return res.status(400).json({ error: 'Deben existir las opciones a, b, c y d' });
    }

    const nuevaPregunta = new Question({
      categoria: categoria || 'Personalizada',
      pregunta,
      opciones,
      correcta,
      retroalimentacion: retroalimentacion || '',
      esPersonalizada: true
    });

    await nuevaPregunta.save();
    res.status(201).json(nuevaPregunta);
  } catch (error) {
    console.error('Error creando pregunta:', error);
    res.status(500).json({ error: 'Error creando pregunta' });
  }
});

// PUT /api/questions/:id - Editar pregunta
router.put('/:id', async (req, res) => {
  try {
    const pregunta = await Question.findOne({ id: req.params.id });
    if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });

    delete req.body.id; // No permitir cambiar el id

    const actualizada = await Question.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando pregunta' });
  }
});

// DELETE /api/questions/:id - Eliminar pregunta
router.delete('/:id', async (req, res) => {
  try {
    const pregunta = await Question.findOne({ id: req.params.id });
    if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });

    // Solo se pueden eliminar preguntas personalizadas
    if (!pregunta.esPersonalizada) {
      return res.status(403).json({ error: 'No se pueden eliminar preguntas predeterminadas' });
    }

    await Question.findOneAndDelete({ id: req.params.id });
    res.json({ mensaje: 'Pregunta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando pregunta' });
  }
});

module.exports = router;
