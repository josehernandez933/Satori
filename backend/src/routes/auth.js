// =============================================
// SATORI - Rutas de Autenticación
// Registro y Login con Mongoose
// =============================================

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register - Registrar usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el email ya existe
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Crear nuevo usuario (contraseña en texto plano para demo local)
    // En producción se recomienda usar bcrypt para hashear la contraseña
    const nuevoUsuario = new User({
      nombre,
      email,
      password,
      rol, // 'docente' o 'estudiante'
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${nombre}`
    });

    await nuevoUsuario.save();

    // Retornar usuario sin contraseña
    const userObj = nuevoUsuario.toObject();
    delete userObj.password;
    delete userObj._id; // Opcional, si prefieres usar solo 'id'
    
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: userObj });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const usuario = await User.findOne({ email, password });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const userObj = usuario.toObject();
    delete userObj.password;
    delete userObj._id;

    res.json({ mensaje: 'Login exitoso', usuario: userObj });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/users - Listar usuarios (solo para debug/admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, _id: 0 }); // Excluir password y _id
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

module.exports = router;
