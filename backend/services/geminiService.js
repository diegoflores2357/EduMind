// backend/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Envía un mensaje a Gemini y obtiene respuesta
 * @param {string} mensaje - Pregunta del usuario
 * @param {Array} historial - Mensajes anteriores de la conversación
 * @returns {string} - Respuesta de la IA
 */
const enviarMensajeGemini = async (mensaje, historial = []) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Construir contexto con historial
        let contexto = `Eres un tutor de programación amigable y didáctico. 
Tu objetivo es ayudar a estudiantes a aprender programación de forma clara y práctica.

Reglas importantes:
- Explica conceptos de forma simple
- Usa ejemplos de código cuando sea relevante
- Si no sabes algo, admítelo
- Sé paciente y motivador

`;
        
        // Agregar historial reciente (últimos 5 mensajes)
        if (historial.length > 0) {
            const ultimosMensajes = historial.slice(-5);
            contexto += "Conversación anterior:\n";
            ultimosMensajes.forEach(msg => {
                contexto += `${msg.rol === 'user' ? 'Usuario' : 'Asistente'}: ${msg.contenido}\n`;
            });
        }
        
        contexto += `\nUsuario: ${mensaje}\nAsistente:`;
        
        const result = await model.generateContent(contexto);
        const response = await result.response;
        return response.text();
        
    } catch (error) {
        console.error('❌ Error en Gemini:', error);
        
        if (error.message.includes('API key')) {
            throw new Error('API Key de Gemini inválida o no configurada');
        }
        
        throw new Error('Error al comunicarse con Gemini');
    }
};

module.exports = { enviarMensajeGemini };