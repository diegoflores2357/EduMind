// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');  // ← SIN .js y SIN llaves

// Cargar variables de entorno
dotenv.config();

// Crear app
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware CORS (mejorado)
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://edumind-production-41b6.up.railway.app',  
        'https://edu-mind-eosin.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contenidos', require('./routes/contenidos'));  // ← Agregar si tienes
app.use('/api/chatbot', require('./routes/chatbot'));        // ← Agregar si tienes

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({
        mensaje: '🚀 Servidor funcionando correctamente',
        timestamp: new Date(),
        mongodb: require('mongoose').connection.readyState === 1 ? 'Conectado ✅' : 'Desconectado ❌'
    });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        proyecto: 'EduMind ChatBot',
        version: '1.0.0',
        estado: 'Activo',
        endpoints: {
            test: 'GET /api/test',
            registro: 'POST /api/auth/registro',
            login: 'POST /api/auth/login',
            perfil: 'GET /api/auth/perfil'
        }
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        ruta: req.originalUrl,
        metodo: req.method
    });
});

// 500
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err.stack);
    res.status(500).json({
        error: 'Error del servidor',
        mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {  // ← 0.0.0.0 para Railway
    console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/`);
    console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}\n`);
});