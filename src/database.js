// 1. Importamos o driver do SQLite
const sqlite3 = require('sqlite3').verbose();

// 2. Conectamos ao banco de dados (ou criamos se não existir)
// O arquivo será criado na pasta 'dados' com o nome 'monitoramento.db'
const db = new sqlite3.Database('./dados/monitoramento.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// 3. Criamos a tabela de leituras
// SQL é a linguagem padrão de bancos de dados.
// Estamos dizendo: "Crie a tabela 'leituras' SE ela ainda não existir"
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS leituras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperatura REAL,
            umidade REAL,
            metano REAL,
            ph REAL,
            pressao REAL,
            data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// 4. Exportamos o objeto 'db' para que o server.js possa usá-lo
module.exports = db;