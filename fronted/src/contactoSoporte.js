/*=== Variables === */
const contenedor = document.querySelector('#contacto');
const contacto = document.querySelector('#formulario');

const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');
const enviar = document.querySelector('#enviar');

const home = document.querySelector('#home');

const datosFormulario = { // Objeto para guardar los datos
    asunto: '',
    mensaje: ''
}

const listaCorreos = [];

console.log(datosFormulario)
console.log(listaCorreos)

// Correos de los maestros (ejemplos) 
const correoSoporte = { id: "Soporte", correo: "soporteTecnico@gmail.com" };

/*=== Eventos === */
eventListeners()

function eventListeners() {
    asunto.addEventListener('input', validarCampo);
    mensaje.addEventListener('input', validarCampo);
    contacto.addEventListener('submit', enviarCorreo);
    // Regresar a pagina de inicio
    home.addEventListener('click', () => {
        const url = '../pages/adminUsuario.html';
        window.location.href = url;
    })
}

/* === Funciones === */

// Enviar correo
function enviarCorreo(e) {
    e.preventDefault();
    informacionCampos();
}

enviar.disabled = true;

// Validar que haya información dentro de un campo
function validarCampo(e) {
    const campo = e.target;
    const valor = campo.value.trim();

    // Limpiar siempre la alerta al inicio
    limpiarAlerta(campo);

    // Validar si el campo esta vacio
    if (valor === '') {
        mostarAlerta('Este campo es obligatorio', campo);
        datosFormulario[campo.id] = '';
        enviar.disabled = true;
    } else {
        datosFormulario[campo.id] = valor;
        enviar.disabled = false;
    }
}

// Mensaje de alerta en caso de que algun campo este incompleto
function mostarAlerta(msj, referencia) {
    limpiarAlerta(referencia);

    // Creacion de alerta
    const error = document.createElement('P');
    error.classList.add('error');
    error.textContent = msj;
    referencia.parentElement.insertAdjacentElement('afterend', error);

    // Cambiar el color del border el input o textarea
    const borderError = '1px solid #b81414';
    referencia.style.border = borderError;
}

function limpiarAlerta(referencia) {
    // 1. Buscar el elemento adyacente (la alerta)
    const alerta = referencia.parentElement.nextElementSibling;

    // 2. CORRECCIÓN: Usar la variable 'alerta'
    if (alerta && alerta.classList.contains('error')) {
        alerta.remove();

        // Resetear el borde al estado inicial (si no hay error)
        referencia.style.border = '1px solid #444';
    }
}

function informacionCampos() {
    const mensajeFinal = {
        asunto: datosFormulario.asunto,
        mensaje: datosFormulario.mensaje,
    };

    listaCorreos.push(mensajeFinal);

    reiniciarOpciones();

    // Agregar el correo al localStorage
    local();
}

// Reincia todos los campos
function reiniciarOpciones() {
    asunto.value = '';
    mensaje.value = '';
}

function local() {
    const correos = JSON.stringify(listaCorreos);
    localStorage.setItem('enviados', correos);
}