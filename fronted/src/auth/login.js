// frontend/src/auth/login.js
const API_URL = 'https://edumind-production-41b6.up.railway.app/';

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
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // Redirigir
        window.location.href = 'adminUsuario.html';
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar Sesión';
    }
});

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}