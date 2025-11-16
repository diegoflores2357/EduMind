// frontend/src/inicio.js
document.addEventListener('DOMContentLoaded', () => {
    const botonesSesion = document.querySelectorAll('.btnSesion');
    
    botonesSesion.forEach(boton => {
        boton.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            
            if (token) {
                // Ya tiene sesión activa
                window.location.href = 'adminUsuario.html';
            } else {
                // No tiene sesión
                if (boton.textContent.includes('Registrate')) {
                    window.location.href = 'registro.html';
                } else {
                    window.location.href = 'login.html';
                }
            }
        });
    });
});