const https = require("https");

module.exports = makeRequest;

function makeRequest(url, { method = "GET", headers = {}, params = {}, body = {} } = {}) {
	let keys = Object.keys(params);
	for (let i = 0; i < keys.length; i++) {
		url += `${ i === 0 ? "?" : "&" }${ keys[i] }=${ params[keys[i]] }`;
	}
	keys = null;

	body = typeof body === "string" ? body : JSON.stringify(body);
	return new Promise((resolve, reject) => {
		const client = https.request(url, { method, headers }, response => {
			if (response.statusCode === 302) {
				resolve(makeRequest(response.headers.location, { method, headers, body }));
			} else if (response.statusCode === 200 || response.statusCode === 204) {
				let chunks = [];

				response.on("data", chunk => chunks.push(chunk));
				response.once("end", () => {
					const responseBody = Buffer.concat(chunks).toString();
					chunks = null;
					if (responseBody.startsWith("<!DOCTYPE")) {
						resolve({ data: responseBody });
					} else {
						resolve(JSON.parse(`{ "data":${ responseBody } }`));
					}
				});
				response.once("error", error => reject(`Error: ${ error.message }`));
			} else {
				reject(`Error ${ response.statusCode }: ${ response.statusMessage }`);
			}
		});

		if (method === "POST") client.write(body);
		client.end();
		client.once("error", reject);
	});
}