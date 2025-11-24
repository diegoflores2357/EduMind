// backend/routes/chatbot.js
const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const Conversacion = require('../models/Conversacion');
const { enviarMensajeGemini } = require('../services/geminiService');

// GET /api/chatbot/conversaciones - Obtener historial
router.get('/conversaciones', protegerRuta, async (req, res) => {
    try {
        const conversaciones = await Conversacion.find({ 
            usuario: req.usuario._id,
            activa: true
        })
        .sort({ ultimaActividad: -1 })
        .select('titulo ultimaActividad mensajes')
        .limit(20);
        
        res.json({ conversaciones });
    } catch (error) {
        console.error('Error al obtener conversaciones:', error);
        res.status(500).json({ error: 'Error al obtener conversaciones' });
    }
});

// GET /api/chatbot/conversacion/:id - Obtener una conversación específica
router.get('/conversacion/:id', protegerRuta, async (req, res) => {
    try {
        const conversacion = await Conversacion.findOne({
            _id: req.params.id,
            usuario: req.usuario._id
        });
        
        if (!conversacion) {
            return res.status(404).json({ error: 'Conversación no encontrada' });
        }
        
        res.json({ conversacion });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener conversación' });
    }
});

// POST /api/chatbot/mensaje - Enviar mensaje al chatbot
router.post('/mensaje', protegerRuta, async (req, res) => {
    try {
        const { mensaje, conversacionId } = req.body;
        
        if (!mensaje || mensaje.trim() === '') {
            return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
        }
        
        let conversacion;
        
        // Si hay conversacionId, buscar la conversación existente
        if (conversacionId) {
            conversacion = await Conversacion.findOne({
                _id: conversacionId,
                usuario: req.usuario._id
            });
            
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
        } else {
            // Crear nueva conversación
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
        
        // Obtener respuesta de Gemini con contexto
        const respuestaIA = await enviarMensajeGemini(
            mensaje, 
            conversacion.mensajes
        );
        
        // Agregar respuesta del bot
        conversacion.mensajes.push({
            rol: 'assistant',
            contenido: respuestaIA
        });
        
        // Actualizar última actividad
        conversacion.ultimaActividad = Date.now();
        await conversacion.save();
        
        res.json({ 
            respuesta: respuestaIA,
            conversacionId: conversacion._id,
            timestamp: new Date()
        });
        
    } catch (error) {
        console.error('Error al procesar mensaje:', error);
        res.status(500).json({ 
            error: 'Error al procesar mensaje',
            detalle: error.message 
        });
    }
});

// DELETE /api/chatbot/conversacion/:id - Eliminar conversación
router.delete('/conversacion/:id', protegerRuta, async (req, res) => {
    try {
        const conversacion = await Conversacion.findOneAndUpdate(
            { _id: req.params.id, usuario: req.usuario._id },
            { activa: false },
            { new: true }
        );
        
        if (!conversacion) {
            return res.status(404).json({ error: 'Conversación no encontrada' });
        }
        
        res.json({ mensaje: 'Conversación eliminada' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar conversación' });
    }
});

module.exports = router;