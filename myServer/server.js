const http = require('http');

const HOSTNAME = '127.0.0.1'
const PORT = 3000

const server = http.createServer((req, res) => {

	res.setHeader('Acess-Control-Allow-Origin', '*');
	res.setHeader('Acess-Control-Allow-Methods', 'POST, GET, OPTIONS');
	res.setHeader('Acess-Control-Allow-Headers', 'Content-Type');

	if (res.method === 'OPTIONS'){
		res.statusCode = 200;
		res.end();
		return ;
	}

	if (res.method === 'POST') {
		let body = '';

		req.on('data', chunk => {
			body += chunk;
		});

		req.on('end', () => {
			try{
				const receivedData = JSON.parse(body);
				const userText = receivedData.texto;

				res.statusCode = 201;
				res.setHeader('Content-Type', 'apllications/json');

				const answJSON = {
					msg: `reeived: ${userText}`,
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
	
	}
});

server.listen(PORT, HOSTNAME, () => {
	console.log(`Server is running successfully on http://${HOSTNAME}:${PORT}`);
});