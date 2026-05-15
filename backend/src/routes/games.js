// =============================================
// SATORI - Rutas de Historial de Partidas
// =============================================

const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET /api/games - Obtener historial de partidas
router.get('/', async (req, res) => {
  try {
    const { docenteId } = req.query;
    const query = docenteId ? { docenteId } : {};
    
    // Buscar y ordenar por fecha descendente
    const games = await Game.find(query).sort({ finalizadoEn: -1 });
    res.json(games);
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

module.exports = router;
