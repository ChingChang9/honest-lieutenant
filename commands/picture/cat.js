const Command = require("@/client/command.js");
const request = require("@/workers/request.js");
const { catAPIAuth } = require("@/config.json");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "cat",
			group: "picture",
			aliases: ["mao", "kitty"],
			description: "Sends a cute cat",
			format: "[breed-id]",
			examples: [
				{
					input: "",
					explanation: "Sends a random cat!"
				},
				{
					input: "beng",
					explanation: "Sends a random Bengal"
				},
				{
					input: "breeds",
					explanation: "Lists the breeds and their IDs"
				}
			],
			arguments: [
				{
					key: "breedId",
					default: ""
				}
			]
		});
	}

	async run(message, { breedId }) {
		if (breedId === "breeds") {
			const breedsArray = await request("https://api.thecatapi.com/v1/breeds", {
				headers: {
					"x-api-key": catAPIAuth
				}
			}).then(response => response.data);
			return message.embed({
				author: {
					name: "List of Cat Breed IDs"
				},
				description: breedsArray.map(breed => `${ breed.name }: \`${ breed.id }\``).join("\n")
			});
		} else if (breedId) {
			breedId = `?breed_id=${ breedId }`;
		}
		const url = await request(`https://api.thecatapi.com/v1/images/search${ breedId }`).then(response => response.data[0].url);
		message.embed({
			image: { url },
			footer: {
				text: "Provided by TheCatAPI"
			}
		});
	}
};