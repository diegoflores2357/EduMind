// backend/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
Eres un tutor de programación amigable y didáctico. 
Tu objetivo es ayudar a estudiantes a aprender programación de forma clara y práctica.

Reglas importantes:
- Explica conceptos de forma simple
- Usa ejemplos de código cuando sea relevante
- Si no sabes algo, admítelo
- Sé paciente y motivador
- Usa formato LaTeX para fórmulas matemáticas: usa $...$ para inline y $$...$$ para bloques
- Usa bloques de código con triple comilla invertida (\`\`\`) para ejemplos de código
- Usa **texto** para negritas
- Usa listas con guión (-) o asterisco (*)

Ejemplos de formato:
- Fórmula inline: La ecuación es $x^2 + 2x + 1 = 0$
- Fórmula en bloque: 
$$
x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$

- Código:
\`\`\`python
def suma(a, b):
    return a + b
\`\`\`
`;

/**
 * Envía un mensaje a Gemini y obtiene respuesta
 * @param {string} mensaje - Pregunta del usuario
 * @param {Array} historial - Mensajes anteriores de la conversación
 * @returns {string} - Respuesta de la IA
 */
const enviarMensajeGemini = async (mensaje, historial = []) => {
    try {
        // ✅ MODELO CORRECTO: gemini-1.5-flash
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash-preview-09-2025'
        });
        
        // Construir el historial en formato de Gemini
        let contents = [];
        
        // Agregar mensajes anteriores
        historial.forEach(msg => {
            contents.push({
                role: msg.rol === 'user' ? 'user' : 'model',
                parts: [{ text: msg.contenido }]
            });
        });
        
        // Agregar mensaje actual
        contents.push({
            role: 'user',
            parts: [{ text: mensaje }]
        });
        
        // Generar respuesta con instrucciones del sistema
        const chat = model.startChat({
            history: contents.slice(0, -1), // Todo excepto el último mensaje
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            },
        });
        
        // Enviar el último mensaje y esperar respuesta
        const result = await chat.sendMessage(mensaje);
        const response = await result.response;
        const text = response.text();
        
        // Agregar las instrucciones del sistema al inicio de la respuesta si es el primer mensaje
        if (historial.length === 0) {
            return `${text}\n\n_Recuerda: Puedo ayudarte con programación, matemáticas y conceptos de computación. Usa formato LaTeX para ecuaciones ($x^2$) y bloques de código (\`\`\`python)._`;
        }
        
        return text;
        
    } catch (error) {
        console.error('❌ Error en Gemini:', error);
        
        // Manejar errores específicos
        if (error.message && error.message.includes('API key')) {
            throw new Error('API Key de Gemini inválida o no configurada');
        }
        
        if (error.status === 404) {
            throw new Error('El modelo de Gemini no está disponible. Verifica la configuración.');
        }
        
        if (error.status === 429) {
            throw new Error('Límite de solicitudes excedido. Intenta de nuevo en unos segundos.');
        }
        
        if (error.status === 500) {
            throw new Error('Error interno del servidor de Gemini. Intenta de nuevo.');
        }
        
        // Error genérico
        throw new Error(`Error al comunicarse con Gemini: ${error.message}`);
    }
};

module.exports = { enviarMensajeGemini };