

const http = require('http');

const HOSTNAME = '127.0.0.1'
const PORT = 3000

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-type', 'application/json');

	const resp = {
		mensagem: "Server is running",
		status: "success"
	};

	res.end(JSON.stringify(resp));
});

server.listen(PORT, HOSTNAME, () => {
	console.log(`Server is running successfully on http://${HOSTNAME}:${PORT}`);
});