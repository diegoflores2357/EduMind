
// Variables 
const divChat = document.getElementById('divChat');
const input = document.getElementById('inputUser');
const btnEnviar = document.getElementById('btnEnviar');
const btnAddChat = document.getElementById('btnAddChat');

// Eventos
if (btnEnviar) {
    btnEnviar.addEventListener('click', entrada);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            entrada()
        }
    })
}

// Funciones
function entrada() {
    const userMsj = input.value.trim(); 
    if (userMsj === '') return; // No enviar mensajes vacíos

    // Llama a mensajeUsuario con el texto (string)
    mensajeUsuario(userMsj);
    limpiarInput();
}

function mensajeUsuario(msj) { 
    const user = document.createElement('P');
    user.classList.add('chat-user');
    user.textContent = msj;
    divChat.appendChild(user);

    mensajeBot(msj);
}

function mensajeBot(mensajeTextoUsuario) { 
    const mensaje = mensajeTextoUsuario.toLowerCase();
    const respuestaEncontrada = respuestasBot.find(item => item.pregunta.toLowerCase() === mensaje);
    let textoRespuesta;

    if (respuestaEncontrada) {
        textoRespuesta = respuestaEncontrada.respuesta;
    } else {
        textoRespuesta = 'Disculpe no puedo resolver eso';
    }
    const bot = document.createElement('P');
    bot.classList.add('chat-bot');
    bot.textContent = textoRespuesta;
    divChat.appendChild(bot);

    divChat.scrollTop = divChat.scrollHeight;
}

function limpiarInput() {
    input.value = ''
}
