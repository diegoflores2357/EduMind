import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';

// Cargar variables de entorno
dotenv.config();

// Crear app
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    mensaje: '🚀 Servidor funcionando correctamente',
    timestamp: new Date()
  });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    proyecto: 'EduMind ChatBot',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
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
    ruta: req.originalUrl
  });
});

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV}\n`);
});
