// backend/models/Progreso.js
const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  ejercicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ejercicio',
    required: true
  },
  completado: {
    type: Boolean,
    default: false
  },
  intentos: {
    type: Number,
    default: 0
  },
  codigoEnviado: String,
  casosPasados: Number,
  casosTotales: Number,
  fechaCompletado: Date,
  tiempoEmpleado: Number
}, {
  timestamps: true
});

// Un usuario no puede tener dos registros del mismo ejercicio
progresoSchema.index({ usuario: 1, ejercicio: 1 }, { unique: true });

module.exports = mongoose.model('Progreso', progresoSchema);