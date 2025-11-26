// frontend/src/chatbot/chat-api.js
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://edumind-production-41b6.up.railway.app/api';

// Variables globales
const divChat = document.getElementById('divChat');
const input = document.getElementById('inputUser');
const btnEnviar = document.getElementById('btnEnviar');
const contenedorChats = document.getElementById('chats');

let conversacionActual = null;

// Eventos
if (btnEnviar) {
    btnEnviar.addEventListener('click', enviarMensaje);
}

if (input) {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    });
}

// Cargar conversaciones al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarConversaciones();
});

/**
 * Enviar mensaje al chatbot
 */
async function enviarMensaje() {
    const mensaje = input.value.trim();
    if (!mensaje) return;
    
    // Mostrar mensaje del usuario
    mostrarMensajeUsuario(mensaje);
    input.value = '';
    
    // Mostrar indicador de "escribiendo..."
    const indicador = mostrarIndicadorEscribiendo();
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No hay sesión activa');
        }
        
        const response = await fetch(`${API_URL}/chatbot/mensaje`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                mensaje,
                conversacionId: conversacionActual
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al enviar mensaje');
        }
        
        const data = await response.json();
        
        // Si es nueva conversación, guardar ID
        if (!conversacionActual) {
            conversacionActual = data.conversacionId;
            cargarConversaciones(); // Actualizar lista
        }
        
        // Remover indicador
        indicador.remove();
        
        // Mostrar respuesta del bot
        mostrarMensajeBot(data.respuesta);
        
    } catch (error) {
        console.error('Error:', error);
        indicador.remove();
        mostrarMensajeBot('❌ ' + error.message);
    }
}

/**
 * Mostrar mensaje del usuario en el chat
 */
function mostrarMensajeUsuario(texto) {
    const p = document.createElement('p');
    p.classList.add('chat-user');
    p.textContent = texto;
    divChat.appendChild(p);
    divChat.scrollTop = divChat.scrollHeight;
}

/**
 * Mostrar mensaje del bot en el chat
 */
function mostrarMensajeBot(texto) {
    const p = document.createElement('p');
    p.classList.add('chat-bot');
    p.textContent = texto;
    divChat.appendChild(p);
    divChat.scrollTop = divChat.scrollHeight;
}

/**
 * Mostrar indicador de "escribiendo..."
 */
function mostrarIndicadorEscribiendo() {
    const p = document.createElement('p');
    p.classList.add('chat-bot', 'escribiendo');
    p.innerHTML = '<span>●</span><span>●</span><span>●</span>';
    divChat.appendChild(p);
    divChat.scrollTop = divChat.scrollHeight;
    return p;
}

/**
 * Cargar lista de conversaciones anteriores
 */
async function cargarConversaciones() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/chatbot/conversaciones`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) return;
        
        const { conversaciones } = await response.json();
        
        // Limpiar contenedor (excepto mensaje de bienvenida)
        contenedorChats.innerHTML = `
            <div class="item">
                <p>Bienvenido</p>
                <img class="icon" onclick="nuevaConversacion()" src="../icons/add.svg" alt="Nueva">
            </div>
        `;
        
        // Agregar conversaciones
        conversaciones.forEach(conv => {
            const item = document.createElement('div');
            item.classList.add('item', 'chatHistorial');
            item.innerHTML = `
                <p>${conv.titulo}</p>
                <img class="icon" onclick="eliminarConversacion('${conv._id}')" src="../icons/delete-chat.svg" alt="Eliminar">
            `;
            
            item.onclick = (e) => {
                if (!e.target.classList.contains('icon')) {
                    cargarConversacion(conv._id);
                }
            };
            
            contenedorChats.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error al cargar conversaciones:', error);
    }
}

/**
 * Cargar una conversación específica
 */
async function cargarConversacion(id) {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/chatbot/conversacion/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const { conversacion } = await response.json();
        
        // Limpiar chat
        divChat.innerHTML = '';
        
        // Mostrar mensajes
        conversacion.mensajes.forEach(msg => {
            if (msg.rol === 'user') {
                mostrarMensajeUsuario(msg.contenido);
            } else {
                mostrarMensajeBot(msg.contenido);
            }
        });
        
        conversacionActual = id;
        
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Crear nueva conversación
 */
function nuevaConversacion() {
    conversacionActual = null;
    divChat.innerHTML = '<p class="chat-bot">¡Hola! ¿En qué puedo ayudarte hoy?</p>';
}

/**
 * Eliminar conversación
 */
async function eliminarConversacion(id) {
    if (!confirm('¿Eliminar esta conversación?')) return;
    
    try {
        const token = localStorage.getItem('token');
        
        await fetch(`${API_URL}/chatbot/conversacion/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (conversacionActual === id) {
            nuevaConversacion();
        }
        
        cargarConversaciones();
        
    } catch (error) {
        console.error('Error:', error);
    }
}