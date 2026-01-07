const http = require('http');

// CONFIGURAÇÃO DOS SENSORES
// 'passo' agora representa a VARIAÇÃO MÁXIMA que pode acontecer numa leitura.
let sensores = {
    temperatura: { valor: 25.0, passo: 0.5, min: 20, max: 35, direcao: 1 }, 
    umidade:     { valor: 60.0, passo: 2.5, min: 40, max: 90, direcao: 1 },
    metano:      { valor: 300,  passo: 15.0, min: 100, max: 600, direcao: 1 },
    ph:          { valor: 7.0,  passo: 0.1, min: 6.0, max: 8.0, direcao: 1 },
    pressao:     { valor: 1013, passo: 1.5, min: 1000, max: 1025, direcao: 1 }
};

// Função que faz o valor subir/descer com velocidade aleatória
function atualizarCiclo(sensor) {
    // A MUDANÇA ESTÁ AQUI:
    // Sorteamos um número entre 0 e o valor do 'passo' configurado acima.
    // Ex: Se o passo é 0.5, a variação pode ser 0.1, 0.49, 0.0, 0.3...
    let variacaoAleatoria = Math.random() * sensor.passo;
    
    if (sensor.direcao === 1) {
        sensor.valor += variacaoAleatoria; // Sobe um valor aleatório
    } else {
        sensor.valor -= variacaoAleatoria; // Desce um valor aleatório
    }

    // Lógica de bater no Teto e inverter
    if (sensor.valor >= sensor.max) {
        sensor.valor = sensor.max;
        sensor.direcao = -1; // Começa a descer
    }

    // Lógica de bater no Chão e inverter
    if (sensor.valor <= sensor.min) {
        sensor.valor = sensor.min;
        sensor.direcao = 1; // Começa a subir
    }

    return parseFloat(sensor.valor.toFixed(2));
}

function enviarDadosCiclicos() {
    const dadosParaEnvio = {
        temperatura: atualizarCiclo(sensores.temperatura),
        umidade: atualizarCiclo(sensores.umidade),
        metano: atualizarCiclo(sensores.metano),
        ph: atualizarCiclo(sensores.ph),
        pressao: atualizarCiclo(sensores.pressao)
    };

    const dadosJSON = JSON.stringify(dadosParaEnvio);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/sensores',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dadosJSON.length
        }
    };

    const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            const setaTemp = sensores.temperatura.direcao > 0 ? "subindo ↑" : "caindo ↓";
            console.log(`[SIMULADOR] Temp: ${dadosParaEnvio.temperatura}°C (${setaTemp})`);
        }
    });

    req.on('error', (e) => console.error('Erro de conexão!'));
    req.write(dadosJSON);
    req.end();
}

console.log("--- Iniciando Simulação com Variação Aleatória ---");
setInterval(enviarDadosCiclicos, 500);