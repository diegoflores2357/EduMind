// fronted/src/config.js
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';

const API_URL = isLocal 
  ? 'http://localhost:3000/api'
  : 'https://edumind-production-41b6.up.railway.app/api';  // ← AGREGAR https:// y /api

console.log('🌐 Entorno:', isLocal ? 'DESARROLLO' : 'PRODUCCIÓN');
console.log('🔗 API URL:', API_URL);

window.API_CONFIG = { API_URL, isLocal };