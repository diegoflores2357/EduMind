const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

const API_URL = isProduction 
  ? 'https://tu-proyecto.up.railway.app/aphttps://edumind-production-41b6.up.railway.app/i'
  : 'http://localhost:3000/api';

export default API_URL;