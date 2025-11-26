// ========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ========================================

const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://edumind-production-41b6.up.railway.app/api';

// DOM Elements
const divChat = document.getElementById('divChat');
const input = document.getElementById('inputUser');
const btnEnviar = document.getElementById('btnEnviar');
const contenedorChats = document.getElementById('chats');

// Estado
let conversacionActual = null;

// ========================================
// FUNCIONES DE PARSEO (Del compañero)
// ========================================

/**
 * Parsear bloques de código con números de línea
 */
function parseSimpleCodeBlocks(text) {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    
    return text.replace(codeBlockRegex, (match, code) => {
        const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const lines = escapedCode.trim().split('\n');
        
        let lineNumbersHtml = '<div class="line-numbers">';
        let codeContentHtml = '<div class="code-content"><code>';
        
        for (let i = 0; i < lines.length; i++) {
            lineNumbersHtml += `<div>${i + 1}</div>`;
            codeContentHtml += lines[i] + (i < lines.length - 1 ? '\n' : ''); 
        }
        
        lineNumbersHtml += '</div>';
        codeContentHtml += '</code></div>';
        
        return `<pre>${lineNumbersHtml}${codeContentHtml}</pre>`;
    });
}

/**
 * Parsear Markdown simple (negritas, listas)
 */
function parseSimpleTextMarkdown(text) {
    // 1. Negritas (**texto**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 2. Código inline (`codigo`)
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 3. Listas desordenadas (- item o * item)
    const lines = text.split('<br>');
    let inList = false;
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detectar inicio de lista
        if (line.match(/^(\*|-)\s+(.+)$/)) {
            if (!inList) {
                result.push('<ul>');
                inList = true;
            }
            const content = line.replace(/^(\*|-)\s+/, '');
            result.push(`<li>${content}</li>`);
        } else {
            // Línea normal
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            if (line) {
                result.push(line + '<br>');
            }
        }
    }
    
    // Cerrar lista si quedó abierta
    if (inList) {
        result.push('</ul>');
    }
    
    return result.join('');
}

// ========================================
// FUNCIONES DE INTERFAZ (Mejoradas)
// ========================================

/**
 * Mostrar mensaje del usuario en el chat
 */
function mostrarMensajeUsuario(texto) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'flex justify-end mb-3';
    
    const p = document.createElement('p');
    p.classList.add('chat-user');
    
    // Solo reemplazar saltos de línea
    const htmlContent = texto.replace(/\n/g, '<br>');
    p.innerHTML = htmlContent;
    
    messageWrapper.appendChild(p);
    divChat.appendChild(messageWrapper);
    divChat.scrollTop = divChat.scrollHeight;
}

/**
 * Mostrar mensaje del bot en el chat (CON PARSEO)
 */
function mostrarMensajeBot(texto) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'flex justify-start mb-3';
    
    const p = document.createElement('p');
    p.classList.add('chat-bot');
    
    let htmlContent = texto;
    
    // 1. Parsear bloques de código PRIMERO (para evitar conflictos)
    htmlContent = parseSimpleCodeBlocks(htmlContent);
    
    // 2. Reemplazar saltos de línea por <br>
    htmlContent = htmlContent.replace(/\n/g, '<br>');
    
    // 3. Parsear Markdown (negritas, listas, código inline)
    htmlContent = parseSimpleTextMarkdown(htmlContent);
    
    p.innerHTML = htmlContent;
    messageWrapper.appendChild(p);
    divChat.appendChild(messageWrapper);
    
    // 4. Renderizar fórmulas LaTeX (si MathJax está disponible)
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([p]).catch(err => {
            console.warn('MathJax rendering error:', err);
        });
    }
    
    divChat.scrollTop = divChat.scrollHeight;
}

/**
 * Mostrar indicador de "escribiendo..."
 */
function mostrarIndicadorEscribiendo() {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex justify-start mb-3';
    wrapper.id = 'loading-indicator';
    
    const p = document.createElement('p');
    p.classList.add('chat-bot', 'escribiendo');
    p.innerHTML = '<span>●</span><span>●</span><span>●</span>';
    
    wrapper.appendChild(p);
    divChat.appendChild(wrapper);
    divChat.scrollTop = divChat.scrollHeight;
    
    return wrapper;
}

// ========================================
// FUNCIONES DE BACKEND (Tu lógica original)
// ========================================

/**
 * Enviar mensaje al chatbot
 */
async function enviarMensaje() {
    const mensaje = input.value.trim();
    if (!mensaje) return;
    
    // Deshabilitar input
    input.disabled = true;
    btnEnviar.disabled = true;
    
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
        
        // Mostrar respuesta del bot (CON PARSEO)
        mostrarMensajeBot(data.respuesta);
        
    } catch (error) {
        console.error('Error:', error);
        indicador.remove();
        
        // Mostrar error formateado
        const errorMsg = document.createElement('div');
        errorMsg.className = 'flex justify-start mb-3';
        errorMsg.innerHTML = `
            <div class="chat-bot bg-red-900 border border-red-700">
                ❌ <strong>Error:</strong> ${error.message}
            </div>
        `;
        divChat.appendChild(errorMsg);
        divChat.scrollTop = divChat.scrollHeight;
        
    } finally {
        // Rehabilitar input
        input.disabled = false;
        btnEnviar.disabled = false;
        input.focus();
    }
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
        
        // Limpiar contenedor
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
        
        if (!response.ok) {
            throw new Error('Error al cargar conversación');
        }
        
        const { conversacion } = await response.json();
        
        // Limpiar chat
        divChat.innerHTML = '';
        
        // Mostrar mensajes CON PARSEO
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
        divChat.innerHTML = '<p class="chat-bot bg-red-900">Error al cargar conversación</p>';
    }
}

/**
 * Crear nueva conversación
 */
function nuevaConversacion() {
    conversacionActual = null;
    divChat.innerHTML = '<p class="chat-bot">¡Hola! ¿En qué puedo ayudarte hoy?</p>';
    input.focus();
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

// ========================================
// EVENTOS E INICIALIZACIÓN
// ========================================

// Evento click en botón enviar
if (btnEnviar) {
    btnEnviar.addEventListener('click', enviarMensaje);
}

// Evento Enter en input
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