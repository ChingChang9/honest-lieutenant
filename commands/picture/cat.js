const Command = require("@/client/command.js");
const request = require("@/workers/request.js");
const { catAPIAuth } = require("@/config.json");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "cat",
			group: "picture",
			aliases: ["mao", "kitty"],
			description: "Send a cute cat",
			format: "[breed-id]",
			examples: [
				{
					explanation: "Send a random cat!"
				},
				{
					input: "beng",
					explanation: "Send a random Bengal"
				},
				{
					input: "breeds",
					explanation: "List the breeds and their IDs"
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
		const url = await request(`https://api.thecatapi.com/v1/images/search${ breedId }`)
			.then(response => response.data[0].url)
			.catch(() => message.reply("Invalid cat ID\nUse `.cat breeds` for a list of cat IDs"));
		message.embed({
			image: { url },
			footer: {
				text: "Provided by TheCatAPI"
			}
		});
	}
};