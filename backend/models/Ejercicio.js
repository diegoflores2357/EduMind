// backend/models/Ejercicio.js
const mongoose = require('mongoose');

const ejercicioSchema = new mongoose.Schema({
  tema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tema',
    required: true
  },
  nivel: {
    type: String,
    enum: ['basico', 'intermedio', 'avanzado'],
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  enunciado: {
    type: String,
    required: true
  },
  plantillaCodigo: {
    type: String,
    default: '// Escribe tu código aquí'
  },
  casosPrueba: [{
    entrada: mongoose.Schema.Types.Mixed,
    salidaEsperada: mongoose.Schema.Types.Mixed,
    descripcion: String,
    visible: {
      type: Boolean,
      default: true
    }
  }],
  pistas: [String],
  solucionReferencia: String,
  puntos: {
    type: Number,
    default: 10
  },
  dificultad: {
    type: Number,
    min: 1,
    max: 5
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ejercicio', ejercicioSchema);