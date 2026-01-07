// SIMULADOR DE ESP32
// Esse script gera valores aleatórios e envia para o seu servidor.

// Função para gerar número aleatório entre dois valores (min e max)
function gerarAleatorio(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2); // toFixed(2) deixa com 2 casas decimais
}

async function enviarDadosFalsos() {
    // 1. Criamos os dados fictícios
    const dados = {
        temperatura: gerarAleatorio(20, 35), // Entre 20 e 35 graus
        umidade: gerarAleatorio(40, 80),     // Entre 40% e 80%
        metano: gerarAleatorio(100, 500),    // Níveis variados
        ph: gerarAleatorio(6.5, 8.0),        // PH próximo do neutro
        pressao: gerarAleatorio(1000, 1020)  // Pressão atmosférica padrão
    };

    try {
        // 2. Enviamos para o servidor (igual fizemos no teste do console)
        const response = await fetch('http://localhost:3000/api/sensores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const respostaServer = await response.json();
        console.log(`[ENVIADO] Temp: ${dados.temperatura}°C | Status: ${respostaServer.message}`);

    } catch (error) {
        console.error('Erro ao conectar com o servidor. O server.js está rodando?');
    }
}

// 3. Loop infinito: Envia dados a cada 2 segundos (2000ms)
console.log("--- Iniciando Simulação do ESP32 ---");
setInterval(enviarDadosFalsos, 2000);