const http = require('http');

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

	if (req.method === 'POST') {
		let body = '';

		req.on('data', chunk => {
			body += chunk;
		});

		req.on('end', () => {
			try{
				const receivedData = JSON.parse(body);
				const userText = receivedData.text;

				res.statusCode = 201;
				res.setHeader('Content-Type', 'application/json');

				const answJSON = {
					msg: `dados processados com sucesso`,
					receivedContent: userText,
					length: userText.length
				};

				res.end(JSON.stringify(answJSON));
			}
			catch (error){
				res.statusCode = 400;
				res.end(JSON.stringify({ error: "invalid JSON format" }));
			};
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