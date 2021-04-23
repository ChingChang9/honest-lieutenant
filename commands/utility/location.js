const Command = require("@/client/command.js");
const request = require("@/workers/request.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "location",
			group: "utility",
			aliases: ["latitude", "longitude"],
			description: "Show the latitude and longitude of a location",
			format: "<location>",
			arguments: [
				{
					key: "location"
				}
			]
		});
	}

	async run(message, { location }) {
		const [longitude, latitude] = await request(`https://nominatim.openstreetmap.org/search/${ location }/?format=geocodejson`)
			.then(response => response.data.features[0].geometry.coordinates);

		message.embed({
			fields: [
				{
					name: "Latitude",
					value: latitude,
					inline: true
				},
				{
					name: "Longtitude",
					value: longitude,
					inline: true
				}
			]
		});
	}
};