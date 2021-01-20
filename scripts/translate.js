const request = require("@/workers/request.js");
const { v4: uuidv4 } = require("uuid");
const { azurAuth } = require("@/config.json");

module.exports = {
	exec(text) {
		return request("https://api.cognitive.microsofttranslator.com/translate", {
			method: "POST",
			headers: {
				"Ocp-Apim-Subscription-Key": azurAuth,
				"Ocp-Apim-Subscription-Region": "global",
				"Content-Type": "application/json",
				"X-ClientTraceId": uuidv4().toString()
			},
			params: {
				"api-version": "3.0",
				to: "en",
				toScript: "latn"
			},
			body: [{ text }]
		}).then(response => response.data[0].translations[0].text);
	}
};