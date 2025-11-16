// frontend/src/auth/verificarAuth.js
const verificarAutenticacion = () => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (!token || !usuario) {
        // No hay sesión, redirigir a login
        window.location.href = 'login.html';  // ← Sin "pages/"
        return false;
    }
    
    return true;
};

// Ejecutar al cargar páginas protegidas
const paginasProtegidas = ['adminUsuario', 'chatbot', 'temas', 'ejercicios', 'contactoMaestro', 'contactoSoporte'];
const paginaActual = window.location.pathname;

if (paginasProtegidas.some(pagina => paginaActual.includes(pagina))) {
    verificarAutenticacion();
}