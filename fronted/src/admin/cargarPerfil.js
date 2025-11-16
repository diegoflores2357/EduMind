// frontend/src/admin/cargarPerfil.js
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/perfil`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Sesión inválida');
        }
        
        const data = await response.json();
        const usuario = data.usuario;
        
        // Llenar los campos
        document.getElementById('name').value = usuario.nombre;
        document.getElementById('apellidoP').value = usuario.apellidoPaterno;
        document.getElementById('apellidoM').value = usuario.apellidoMaterno || '';
        document.getElementById('matricula').value = usuario.matricula || 'N/A';
        
        // Actualizar localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
});

// Botón cerrar sesión
const btnSalir = document.getElementById('salirSesion');
if (btnSalir) {
    btnSalir.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'inicio.html';
    });
}