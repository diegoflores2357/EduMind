// backend/models/Contenido.js
const mongoose = require('mongoose');

const contenidoSchema = new mongoose.Schema({
  tema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tema',
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  explicacion: {
    type: String,
    required: true
  },
  ejemplos: [{
    lenguaje: String,
    codigo: String,
    descripcion: String
  }],
  recursos: [{
    tipo: {
      type: String,
      enum: ['video', 'imagen', 'enlace', 'pdf']
    },
    url: String,
    titulo: String
  }],
  orden: Number,
  puntosClave: [String],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contenido', contenidoSchema);