// frontend/src/auth/registro.js
const API_URL = 'http://localhost:3000/api';

const formRegistro = document.getElementById('formRegistro');
const btnRegistro = document.getElementById('btnRegistro');
const mensajeError = document.getElementById('mensajeError');
const mensajeExito = document.getElementById('mensajeExito');

formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpiar mensajes
    mensajeError.style.display = 'none';
    mensajeExito.style.display = 'none';
    btnRegistro.disabled = true;
    btnRegistro.textContent = 'Registrando...';
    
    // Obtener valores
    const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        apellidoPaterno: document.getElementById('apellidoPaterno').value.trim(),
        apellidoMaterno: document.getElementById('apellidoMaterno').value.trim(),
        correo: document.getElementById('correo').value.trim().toLowerCase(),
        password: document.getElementById('password').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        nivelConocimiento: document.getElementById('nivelConocimiento').value,
        matricula: document.getElementById('matricula').value.trim()
    };
    
    const confirmarPassword = document.getElementById('confirmarPassword').value;
    
    // Validar contraseñas coinciden
    if (datos.password !== confirmarPassword) {
        mostrarError('Las contraseñas no coinciden');
        btnRegistro.disabled = false;
        btnRegistro.textContent = 'Registrarse';
        return;
    }
    
    // Validar edad (mayor de 13 años)
    const edad = calcularEdad(datos.fechaNacimiento);
    if (edad < 13) {
        mostrarError('Debes tener al menos 13 años para registrarte');
        btnRegistro.disabled = false;
        btnRegistro.textContent = 'Registrarse';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al registrar usuario');
        }
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // Mostrar mensaje de éxito
        mostrarExito('¡Registro exitoso! Redirigiendo...');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'adminUsuario.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
        btnRegistro.disabled = false;
        btnRegistro.textContent = 'Registrarse';
    }
});

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
    mensajeError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function mostrarExito(mensaje) {
    mensajeExito.textContent = mensaje;
    mensajeExito.style.display = 'block';
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    
    return edad;
}