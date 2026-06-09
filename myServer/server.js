const http = require('http');
const db = require('../database');
const { json } = require('stream/consumers');

const HOSTNAME = '127.0.0.1'
const PORT = 3000

const server = http.createServer((req, res) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS'){
		res.statusCode = 200;
		res.end();
		return ;
	}

	if (req.method === 'POST' && req.url === "/registrar") {
		let body = '';

		req.on('data', chunk => {
			body += chunk;
		});

		req.on('end', () => {
			try{
				const receivedData = JSON.parse(body);
				
				const { nome, email, senha } = receivedData;

				if (!nome || !email || !senha)
				{
					res.statusCode = 400;
					return res.end(JSON.stringify({ error: "todos os campos são obrigatórios." }));
				}

				const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';

				db.run(sql, [nome, email, senha], function(err) {
					if (err)
					{
						res.statusCode = 400;
						return res.end(JSON.stringify({ error: "Email já cadastrado" }))
					}

					res.statusCode = 201;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({
						msg: "Usuário registrado com sucesso",
						id: this.lastID
					}));

				})
			}
			catch (error){
				res.statusCode = 400;
				res.end(JSON.stringify({ error: "invalid JSON format" }));
			};
		});
	}
	else if (req.method === "GET" && req.url === "/usuarios"){
		const sql = `SELECT nome FROM usuarios`;
		
		db.all(sql, [], function(err, rows){
			if (err)
			{
				res.statusCode = 400;
				return res.end(JSON.stringify({ error: "erro ao buscar no banco" }))
			}

			const primeirosNomes = rows.map(row => {
				return row.nome.trim().split(' ')[0];
			});
			
			res.statusCode = 200;
			res.setHeader('Content-Type',  'application/json');
			res.end(JSON.stringify(primeirosNomes));
		});
	}
	else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ erro: "Rota não encontrada" }));
	}
});

server.listen(PORT, HOSTNAME, () => {
	console.log(`Server is running successfully on http://${HOSTNAME}:${PORT}`);
});