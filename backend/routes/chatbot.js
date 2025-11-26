const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const Conversacion = require('../models/Conversacion');
const { enviarMensajeGemini } = require('../services/geminiService');

// GET /api/chatbot/conversaciones
router.get('/conversaciones', protegerRuta, async (req, res) => {
    try {
        const conversaciones = await Conversacion.find({ 
            usuario: req.usuario._id,
            activa: true
        })
        .sort({ ultimaActividad: -1 })
        .limit(20);
        
        res.json({ conversaciones });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener conversaciones' });
    }
});

// POST /api/chatbot/nueva - Crear nueva conversación
router.post('/nueva', protegerRuta, async (req, res) => {
    try {
        const conversacion = await Conversacion.create({
            usuario: req.usuario._id,
            titulo: 'Nueva conversación',
            mensajes: [{
                rol: 'assistant',
                contenido: '¡Hola! Soy tu asistente de programación. ¿En qué puedo ayudarte?',
                timestamp: new Date()
            }]
        });
        
        res.json({ conversacion });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear conversación' });
    }
});

// POST /api/chatbot/mensaje
router.post('/mensaje', protegerRuta, async (req, res) => {
    try {
        const { mensaje, conversacionId } = req.body;
        
        if (!mensaje || mensaje.trim() === '') {
            return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
        }
        
        let conversacion;
        
        if (conversacionId) {
            conversacion = await Conversacion.findOne({
                _id: conversacionId,
                usuario: req.usuario._id
            });
            
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
        } else {
            // Crear nueva conversación si no existe
            const titulo = mensaje.length > 30 
                ? mensaje.substring(0, 30) + '...' 
                : mensaje;
                
            conversacion = await Conversacion.create({
                usuario: req.usuario._id,
                titulo: titulo,
                mensajes: []
            });
        }
        
        // Agregar mensaje del usuario
        conversacion.mensajes.push({
            rol: 'user',
            contenido: mensaje
        });
        
        // Obtener respuesta de Gemini
        const respuestaIA = await enviarMensajeGemini(
            mensaje, 
            conversacion.mensajes
        );
        
        // Agregar respuesta del bot
        conversacion.mensajes.push({
            rol: 'assistant',
            contenido: respuestaIA
        });
        
        conversacion.ultimaActividad = Date.now();
        await conversacion.save();
        
        res.json({ 
            respuesta: respuestaIA,
            conversacionId: conversacion._id,
            timestamp: new Date()
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Error al procesar mensaje',
            detalle: error.message 
        });
    }
});

module.exports = router;