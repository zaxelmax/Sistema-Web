// Variáveis globais para armazenar os objetos dos gráficos
let chartTemp, chartUmid, chartMetano, chartPH, chartPressao;

// Função que configura e cria um gráfico vazio (para não repetir código)
function criarGrafico(idCanvas, label, corBorda, corFundo) {
    const ctx = document.getElementById(idCanvas).getContext('2d');
    return new Chart(ctx, {
        type: 'line', // Tipo do gráfico: Linha
        data: {
            labels: [], // Eixo X (Horário) - Começa vazio
            datasets: [{
                label: label,
                data: [], // Eixo Y (Valores) - Começa vazio
                borderColor: corBorda,
                backgroundColor: corFundo,
                borderWidth: 2,
                fill: true, // Preencher abaixo da linha
                tension: 0.6,
                pointRadius: 0,
                pointHoverRadius: 6 // Curvatura da linha (0 = reta, 1 = muito curva)
            }]
        },
        options: {
            responsive: true,
            animation:{
                duration: 150
            },
            scales: {
                x: { display: true, title: { display: true, text: 'Horário' } },
                y: { beginAtZero: false } // O eixo Y se adapta aos valores
            }
        }
    });
}

// 1. Inicializa os gráficos assim que a página carrega
function iniciarGraficos() {
    chartTemp = criarGrafico('graficoTemperatura', 'Temperatura', 'rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.2)');
    chartUmid = criarGrafico('graficoUmidade', 'Umidade', 'rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.2)');
    chartMetano = criarGrafico('graficoMetano', 'Metano', 'rgb(255, 205, 86)', 'rgba(255, 205, 86, 0.2)');
    chartPH = criarGrafico('graficoPH', 'PH', 'rgb(75, 192, 192)', 'rgba(75, 192, 192, 0.2)');
    chartPressao = criarGrafico('graficoPressao', 'Pressão', 'rgb(201, 203, 207)', 'rgba(201, 203, 207, 0.2)');
}

// 2. Busca os dados no servidor e atualiza os gráficos
/*async function atualizarDados() {
    try {
        const response = await fetch('http://localhost:3000/api/sensores');
        const resultado = await response.json();
        const dados = resultado.data; // A lista de leituras do banco

        // Se não tiver dados, não faz nada
        if (dados.length === 0) return;

        // Preparamos os arrays para os gráficos
        // Map: transforma a lista de objetos do banco em listas simples de números
        const horarios = dados.map(d => new Date(d.data_hora).toLocaleTimeString());
        const temps = dados.map(d => d.temperatura);
        const umids = dados.map(d => d.umidade);
        const metanos = dados.map(d => d.metano);
        const phs = dados.map(d => d.ph);
        const pressoes = dados.map(d => d.pressao);

        // Atualizamos o gráfico de Temperatura
        chartTemp.data.labels = horarios;
        chartTemp.data.datasets[0].data = temps;
        chartTemp.update(); // Manda redesenhar

        // Atualizamos Umidade
        chartUmid.data.labels = horarios;
        chartUmid.data.datasets[0].data = umids;
        chartUmid.update();

        // Atualizamos Metano
        chartMetano.data.labels = horarios;
        chartMetano.data.datasets[0].data = metanos;
        chartMetano.update();

        // Atualizamos PH
        chartPH.data.labels = horarios;
        chartPH.data.datasets[0].data = phs;
        chartPH.update();

        // Atualizamos Pressão
        chartPressao.data.labels = horarios;
        chartPressao.data.datasets[0].data = pressoes;
        chartPressao.update();

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}*/
// ... (mantenha as variáveis e a função criarGrafico como estão)

// Substitua APENAS a função atualizarDados por esta:
async function atualizarDados() {
    try {
        console.log("1. Tentando buscar dados...");
        const response = await fetch('http://localhost:3000/api/sensores');
        const resultado = await response.json();
        
        console.log("2. Dados recebidos do servidor:", resultado);

        const dados = resultado.data; 

        if (dados.length === 0) {
            console.log("3. O Banco de dados está vazio!");
            return;
        }

        // Map: transforma a lista de objetos do banco em listas simples de números
        const horarios = dados.map(d => new Date(d.data_hora).toLocaleTimeString());
        const temps = dados.map(d => d.temperatura);
        const umids = dados.map(d => d.umidade);
        const metanos = dados.map(d => d.metano);
        const phs = dados.map(d => d.ph);
        const pressoes = dados.map(d => d.pressao);

        console.log("4. Última Temperatura processada:", temps[temps.length - 1]);

        // Atualizamos o gráfico de Temperatura
        chartTemp.data.labels = horarios;
        chartTemp.data.datasets[0].data = temps;
        chartTemp.update(); 
        
        console.log("5. Gráfico de Temperatura atualizado!");

        // Atualize os outros também...
        chartUmid.data.labels = horarios;
        chartUmid.data.datasets[0].data = umids;
        chartUmid.update();

        chartMetano.data.labels = horarios;
        chartMetano.data.datasets[0].data = metanos;
        chartMetano.update();

        chartPH.data.labels = horarios;
        chartPH.data.datasets[0].data = phs;
        chartPH.update();

        chartPressao.data.labels = horarios;
        chartPressao.data.datasets[0].data = pressoes;
        chartPressao.update();

    } catch (error) {
        console.error('ERRO FATAL:', error);
    }
}

// ... (mantenha o final do arquivo igual)
// Executa a inicialização
document.addEventListener('DOMContentLoaded', () => {
    iniciarGraficos();
    atualizarDados(); // Chama a primeira vez imediatamente
    
    // Configura para atualizar a cada 5 segundos (5000 ms)
    // Assim, quando o ESP mandar dados a cada 2 min, o site pega logo em seguida.
    setInterval(atualizarDados, 600); 
});