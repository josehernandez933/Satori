// =============================================
// SATORI - Rutas de Autenticación
// Registro y Login con LowDB
// =============================================

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// POST /api/auth/register - Registrar usuario
router.post('/register', (req, res) => {
  const db = req.app.locals.db;
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Verificar si el email ya existe
  const existente = db.get('users').find({ email }).value();
  if (existente) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  // Crear nuevo usuario (contraseña en texto plano para demo local)
  const nuevoUsuario = {
    id: uuidv4(),
    nombre,
    email,
    password,
    rol, // 'docente' o 'estudiante'
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${nombre}`,
    creadoEn: new Date().toISOString()
  };

  db.get('users').push(nuevoUsuario).write();

  // Retornar usuario sin contraseña
  const { password: _, ...userSinPassword } = nuevoUsuario;
  res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: userSinPassword });
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', (req, res) => {
  const db = req.app.locals.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const usuario = db.get('users').find({ email, password }).value();
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const { password: _, ...userSinPassword } = usuario;
  res.json({ mensaje: 'Login exitoso', usuario: userSinPassword });
});

// GET /api/auth/users - Listar usuarios (solo para debug/admin)
router.get('/users', (req, res) => {
  const db = req.app.locals.db;
  const users = db.get('users').map(u => {
    const { password, ...rest } = u;
    return rest;
  }).value();
  res.json(users);
});

module.exports = router;
