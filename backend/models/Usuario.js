const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellidoPaterno: {
    type: String,
    required: [true, 'El apellido paterno es obligatorio'],
    trim: true
  },
  apellidoMaterno: {
    type: String,
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Correo inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 8,
    select: false // No se devuelve por defecto
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  nivelConocimiento: {
    type: String,
    enum: ['basico', 'intermedio', 'avanzado'],
    default: 'basico'
  },
  matricula: {
    type: String,
    unique: true,
    sparse: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// MIDDLEWARE: Encriptar password antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// MÉTODO: Comparar password
usuarioSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// MÉTODO: Nombre completo
usuarioSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombre} ${this.apellidoPaterno} ${this.apellidoMaterno || ''}`.trim();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;