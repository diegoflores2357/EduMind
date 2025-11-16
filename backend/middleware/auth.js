// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const protegerRuta = async (req, res, next) => {
  try {
    let token;
    
    // Obtener token del header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No autorizado - Token no proporcionado' 
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    req.usuario = await Usuario.findById(decoded.id).select('-password');
    
    if (!req.usuario) {
      return res.status(401).json({ 
        error: 'No autorizado - Usuario no encontrado' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ 
      error: 'No autorizado - Token inválido' 
    });
  }
};

module.exports = { protegerRuta };