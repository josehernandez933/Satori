// =============================================
// SATORI - Rutas de Cuestionarios (CRUD)
// =============================================

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// GET /api/quizzes - Obtener todos los cuestionarios del docente
router.get('/', async (req, res) => {
  try {
    const { docenteId } = req.query;
    const query = docenteId ? { docenteId } : {};
    const quizzes = await Quiz.find(query);
    res.json(quizzes);
  } catch (error) {
    console.error('Error obteniendo cuestionarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/quizzes/:id - Obtener un cuestionario específico
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.id });
    if (!quiz) return res.status(404).json({ error: 'Cuestionario no encontrado' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo cuestionario' });
  }
});

// POST /api/quizzes - Crear cuestionario
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, docenteId, preguntas, configuracion } = req.body;

    if (!titulo || !docenteId) {
      return res.status(400).json({ error: 'Título y docenteId son requeridos' });
    }

    const nuevoQuiz = new Quiz({
      titulo,
      descripcion: descripcion || '',
      docenteId,
      preguntas: preguntas || [],
      configuracion: {
        tiempoPorPregunta: configuracion?.tiempoPorPregunta || 30,
        mostrarRanking: configuracion?.mostrarRanking !== false,
        sonidos: configuracion?.sonidos !== false,
        ...configuracion
      }
    });

    await nuevoQuiz.save();
    res.status(201).json(nuevoQuiz);
  } catch (error) {
    console.error('Error creando cuestionario:', error);
    res.status(500).json({ error: 'Error creando cuestionario' });
  }
});

// PUT /api/quizzes/:id - Actualizar cuestionario
router.put('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.id });
    if (!quiz) return res.status(404).json({ error: 'Cuestionario no encontrado' });

    // No permitir cambiar ID ni docenteId
    delete req.body.id;
    delete req.body.docenteId;

    const actualizado = await Quiz.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true } // Para que retorne el documento actualizado
    );

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando cuestionario' });
  }
});

// DELETE /api/quizzes/:id - Eliminar cuestionario
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ id: req.params.id });
    if (!quiz) return res.status(404).json({ error: 'Cuestionario no encontrado' });

    res.json({ mensaje: 'Cuestionario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando cuestionario' });
  }
});

module.exports = router;
