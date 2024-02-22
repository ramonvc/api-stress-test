const { faker } = require("@faker-js/faker");
const http = require("http");

const hostname = "0.0.0.0";
const port = 3000;

function generateRandomObject() {
	return {
		userId: faker.string.uuid(),
		username: faker.internet.userName(),
		email: faker.internet.email(),
		avatar: faker.image.avatar(),
		password: faker.internet.password(),
		birthdate: faker.date.birthdate(),
		registeredAt: faker.date.past(),
	};
}

function generateRandomObjects(count) {
	const objects = [];
	for (let i = 0; i < count; i++) {
		objects.push(generateRandomObject());
	}
	return objects;
}

function getObjCount(urlParams) {
	return parseInt(urlParams.get("count"));
}

function getMachineName(urlParams) {
	return urlParams.get("machine");
}

function handleRequest(req, res) {
	if (req.url.startsWith("/stress-test")) {
		res.writeHead(200, { "Content-Type": "application/json" });

		const urlParams = new URLSearchParams(req.url.slice("/stress-test".length));
		const machineName = getMachineName(urlParams);

		console.log(`\n${new Date().toLocaleString("pt-BR")}`);
		console.log(`IP[${req.connection.remoteAddress}] [${res.statusCode}]`);
		if (machineName) console.log(`Machine[${machineName}]`);

		setTimeout(() => {
			const objCount = getObjCount(urlParams);
			const randomObjects = generateRandomObjects(objCount);
			res.end(JSON.stringify(randomObjects));
		}, 500);
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not found");
	}
}

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
	console.log(`Stress test endpoint: http://${hostname}:${port}/stress-test?count=1000`);
});
