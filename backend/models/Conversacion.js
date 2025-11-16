// backend/models/Conversacion.js
const mongoose = require('mongoose');

const conversacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  titulo: {
    type: String,
    default: 'Nueva conversación'
  },
  mensajes: [{
    rol: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    contenido: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  activa: {
    type: Boolean,
    default: true
  },
  ultimaActividad: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas
conversacionSchema.index({ usuario: 1, ultimaActividad: -1 });

const Conversacion = mongoose.model('Conversacion', conversacionSchema);

module.exports = Conversacion;