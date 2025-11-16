// backend/models/Tema.js
const mongoose = require('mongoose');

const temaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  nivel: {
    type: String,
    enum: ['basico', 'intermedio', 'avanzado'],
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  orden: {
    type: Number,
    required: true
  },
  icono: String,
  duracionEstimada: Number,
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tema', temaSchema);