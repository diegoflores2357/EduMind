require('dotenv').config();

console.log('=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===\n');

console.log('✓ MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurado' : '❌ NO configurado');
console.log('✓ JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO configurado');
console.log('✓ PORT:', process.env.PORT || '❌ NO configurado');
console.log('✓ NODE_ENV:', process.env.NODE_ENV || '❌ NO configurado');

console.log('\n=== VALORES (solo para verificación) ===\n');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);