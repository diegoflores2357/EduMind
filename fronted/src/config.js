const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';

// ✅ URL COMPLETA del backend en Railway
const API_URL = isLocal 
  ? 'http://localhost:3000/api'
  : 'edumind-production-41b6.up.railway.app';

console.log('🌍 Entorno:', isLocal ? 'DESARROLLO' : 'PRODUCCIÓN');
console.log('🔗 API URL:', API_URL);

// Exportar globalmente
window.API_CONFIG = { API_URL, isLocal };