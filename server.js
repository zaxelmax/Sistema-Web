const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/database'); 
const path = require('path'); // Nova ferramenta para lidar com caminhos de pastas


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- AQUI ESTÁ A MÁGICA ---
// Estamos dizendo: "Servidor, sirva os arquivos estáticos (HTML, CSS, JS) 
// que estão na pasta raiz do projeto".
app.use(express.static(__dirname)); 

// Rota para salvar (POST)
app.post('/api/sensores', (req, res) => {
    const { temperatura, umidade, metano, ph, pressao } = req.body;
    const sql = `INSERT INTO leituras (temperatura, umidade, metano, ph, pressao) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [temperatura, umidade, metano, ph, pressao], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Dados salvos com sucesso!", id: this.lastID });
        console.log(`Dados recebidos: Temp ${temperatura}, PH ${ph}`);
    });
});

// Rota para ler (GET)
app.get('/api/sensores', (req, res) => {
    const sql = "SELECT * FROM leituras ORDER BY data_hora ASC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});