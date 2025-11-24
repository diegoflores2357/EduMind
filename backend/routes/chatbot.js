// backend/routes/chatbot.js
const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const Conversacion = require('../models/Conversacion');

// GET /api/chatbot/conversaciones
router.get('/conversaciones', protegerRuta, async (req, res) => {
    try {
        const conversaciones = await Conversacion.find({ 
            usuario: req.usuario._id,
            activa: true
        }).sort({ ultimaActividad: -1 });
        
        res.json({ conversaciones });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener conversaciones' });
    }
});

// POST /api/chatbot/mensaje
router.post('/mensaje', protegerRuta, async (req, res) => {
    try {
        const { mensaje } = req.body;
        
        // Por ahora respuesta simple
        res.json({ 
            respuesta: `Recibí tu mensaje: "${mensaje}". Sistema en desarrollo.`,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al procesar mensaje' });
    }
});

module.exports = router;