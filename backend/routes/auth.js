// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { protegerRuta } = require('../middleware/auth');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, password, fechaNacimiento, nivelConocimiento, matricula } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !apellidoPaterno || !correo || !password || !fechaNacimiento) {
      return res.status(400).json({ 
        error: 'Todos los campos requeridos deben ser proporcionados' 
      });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ correo });
    if (usuarioExiste) {
      return res.status(400).json({ 
        error: 'El correo ya está registrado' 
      });
    }
    
    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      password,
      fechaNacimiento,
      nivelConocimiento: nivelConocimiento || 'basico',
      matricula
    });
    
    const token = generarToken(usuario._id);
    
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        nivelConocimiento: usuario.nivelConocimiento
      }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      detalle: error.message 
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    
    if (!correo || !password) {
      return res.status(400).json({ 
        error: 'Correo y contraseña son requeridos' 
      });
    }
    
    const usuario = await Usuario.findOne({ correo }).select('+password');
    
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    const passwordCorrecta = await usuario.compararPassword(password);
    
    if (!passwordCorrecta) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    usuario.ultimoAcceso = Date.now();
    await usuario.save();
    
    const token = generarToken(usuario._id);
    
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        correo: usuario.correo,
        nivelConocimiento: usuario.nivelConocimiento,
        matricula: usuario.matricula
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      detalle: error.message 
    });
  }
});

// GET /api/auth/perfil
router.get('/perfil', protegerRuta, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    
    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        correo: usuario.correo,
        fechaNacimiento: usuario.fechaNacimiento,
        nivelConocimiento: usuario.nivelConocimiento,
        matricula: usuario.matricula,
        fechaRegistro: usuario.fechaRegistro,
        ultimoAcceso: usuario.ultimoAcceso
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

module.exports = router;