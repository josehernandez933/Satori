// =============================================
// SATORI - Rutas de Historial de Partidas
// =============================================

const express = require('express');
const router = express.Router();

// GET /api/games - Obtener historial de partidas
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { docenteId } = req.query;
  let games = db.get('games').value();
  if (docenteId) {
    games = games.filter(g => g.docenteId === docenteId);
  }
  // Ordenar por fecha descendente
  games.sort((a, b) => new Date(b.finalizadoEn) - new Date(a.finalizadoEn));
  res.json(games);
});

// GET /api/games/:id - Detalle de una partida
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const game = db.get('games').find({ id: req.params.id }).value();
  if (!game) return res.status(404).json({ error: 'Partida no encontrada' });
  res.json(game);
});

module.exports = router;
