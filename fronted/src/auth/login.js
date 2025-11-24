// frontend/src/auth/login.js
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';

const API_URL = isLocal 
    ? 'http://localhost:3000/api'
    : 'https://edumind-production-41b6.up.railway.app/api';

const formLogin = document.getElementById('formLogin');
const btnLogin = document.getElementById('btnLogin');
const mensajeError = document.getElementById('mensajeError');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    mensajeError.style.display = 'none';
    btnLogin.disabled = true;
    btnLogin.textContent = 'Iniciando sesión...';
    
    const datos = {
        correo: document.getElementById('correo').value.trim().toLowerCase(),
        password: document.getElementById('password').value
    };
    
    try {
        console.log('🔗 Intentando login en:', `${API_URL}/auth/login`);
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al iniciar sesión');
        }
        
        const data = await response.json();
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        console.log('✅ Login exitoso');
        
        // Redirigir
        window.location.href = 'adminUsuario.html';
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        mostrarError(error.message);
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar Sesión';
    }
});

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}