const http = require('http');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

// Criamos um servidor básico para o Render não dar erro de checagem
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Robô da Júlia está Ativo! 🚀');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Configuração do cérebro do robô
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function responderCliente(mensagemDoCliente) {
    const dadosDosProdutos = fs.readFileSync('produtos.json', 'utf-8');
    const roteiroDoSistema = `
        Você é a Júlia, uma vendedora simpática de uma loja de moda íntima.
        Use estas regras: respostas curtas, emojis normais e termine sempre com uma pergunta.
        Aqui está o catálogo oficial: ${dadosDosProdutos}
    `;

    try {
        const respostaDaIA = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: roteiroDoSistema }] },
                { role: 'user', parts: [{ text: mensagemDoCliente }] }
            ]
        });
        return respostaDaIA.text;
    } catch (erro) {
        return "Tive um probleminha técnico rápida, pode repetir?";
    }
}
