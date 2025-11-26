require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        console.log('🔑 API Key:', process.env.GEMINI_API_KEY ? 'Configurada ✅' : 'NO configurada ❌');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });
        
        console.log('📡 Enviando mensaje de prueba...');
        
        const result = await model.generateContent('Di hola');
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Respuesta:', text);
        console.log('\n🎉 API funcionando correctamente');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('📊 Detalles:', error);
    }
}

testGemini();