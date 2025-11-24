// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB Atlas conectado correctamente');
        console.log('📊 Base de datos:', mongoose.connection.name);
        
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
});

module.exports = connectDB;  // ← SIN llaves