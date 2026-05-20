// =============================================
// SATORI - Rutas de Historial de Partidas
// =============================================

const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Quiz = require('../models/Quiz');

// GET /api/games - Obtener historial de partidas con información agregada
router.get('/', async (req, res) => {
  try {
    const { docenteId } = req.query;
    const query = docenteId ? { docenteId } : {};
    
    // Buscar y ordenar por fecha descendente
    const games = await Game.find(query).sort({ finalizadoEn: -1 });
    
    // Formatear y poblar dinámicamente datos asociados para el frontend
    const gamesFormatted = await Promise.all(games.map(async (game) => {
      // Buscar cuestionario asociado para título y número de preguntas
      const quiz = await Quiz.findOne({ id: game.quizId });
      
      const quizTitulo = quiz ? quiz.titulo : 'Cuestionario Eliminado';
      const totalPreguntas = quiz ? quiz.preguntas.length : 0;
      
      // Calcular podio (Top 3 jugadores ordenados por puntos descendente)
      const podio = [...game.jugadores]
        .sort((a, b) => b.puntos - a.puntos)
        .slice(0, 3)
        .map((j, idx) => ({
          posicion: idx + 1,
          nombre: j.nombre,
          avatar: j.avatar,
          puntos: j.puntos
        }));
        
      return {
        id: game.id,
        codigo: game.pin,
        quizId: game.quizId,
        docenteId: game.docenteId,
        quizTitulo,
        totalPreguntas,
        jugadores: game.jugadores.length,
        podio,
        iniciadoEn: game.iniciadoEn,
        finalizadoEn: game.finalizadoEn,
        estado: game.estado
      };
    }));
    
    res.json(gamesFormatted);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
});

// GET /api/games/:id - Detalle de una partida
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.id });
    if (!game) return res.status(404).json({ error: 'Partida no encontrada' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo partida' });
  }
});

// DELETE /api/games/:id - Eliminar una partida del historial
router.delete('/:id', async (req, res) => {
  try {
    const result = await Game.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: 'Partida no encontrada' });
    res.json({ mensaje: 'Partida eliminada con éxito del historial' });
  } catch (error) {
    console.error('Error al eliminar partida:', error);
    res.status(500).json({ error: 'Error al eliminar la partida' });
  }
});

module.exports = router;
