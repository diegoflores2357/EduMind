// backend/routes/contenidos.js
const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const Tema = require('../models/Tema');
const Contenido = require('../models/Contenido');

// GET /api/contenidos/temas?nivel=basico
router.get('/temas', protegerRuta, async (req, res) => {
    try {
        const { nivel } = req.query;
        
        const query = { activo: true };
        if (nivel) query.nivel = nivel;
        
        const temas = await Tema.find(query).sort({ orden: 1 });
        
        res.json({ temas });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener temas' });
    }
});

// GET /api/contenidos/tema/:id
router.get('/tema/:id', protegerRuta, async (req, res) => {
    try {
        const tema = await Tema.findById(req.params.id);
        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }
        
        const contenidos = await Contenido.find({ 
            tema: req.params.id, 
            activo: true 
        }).sort({ orden: 1 });
        
        res.json({ tema, contenidos });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener contenidos' });
    }
});

module.exports = router;