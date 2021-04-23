const Command = require("@/client/command.js");
const request = require("@/workers/request.js");
const { openWeatherKey } = require("@/config.json");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "weather",
			group: "utility",
			description: "Show the current weather of a location",
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
			.then(response => response.data.features[0]?.geometry.coordinates || []);

		if (!longitude && !latitude) return message.reply("Couldn't find the location 😔😔");

		const data = await request(`https://api.openweathermap.org/data/2.5/weather?lat=${
			latitude }&lon=${ longitude }&appid=${ openWeatherKey }&units=metric`).then(response => response.data);

		message.embed({
			author: {
				name: data.name
			},
			thumbnail: {
				url: `http://openweathermap.org/img/wn/${ data.weather[0].icon }@4x.png`
			},
			description: `${ data.weather[0].main } (${ data.weather[0].description })`,
			fields: [
				{
					name: "Temperature",
					value: `${ data.main.temp }°C`,
					inline: true
				},
				{
					name: "Feels like",
					value: `${ data.main.feels_like }°C`,
					inline: true
				},
				{
					name: "Low ~ High",
					value: `${ data.main.temp_min }°C ~ ${ data.main.temp_max }°C`,
					inline: true
				},
				{
					name: "Humidity",
					value: `${ data.main.humidity }%`,
					inline: true
				},
				{
					name: "Clouds",
					value: `${ data.clouds.all}%`,
					inline: true
				},
				{
					name: "Wind",
					value: `${ data.wind.speed }m/s ${ getDirection(data.wind.deg) }`,
					inline: true
				}
			],
			footer: {
				text: "Powered by openweathermap.org"
			}
		});
	}
};

function getDirection(degree) {
	return degree < 22.5 || degree >= 337.5 ? "North" :
		degree < 67.5 ? "Northeast" :
		degree < 112.5 ? "East" :
		degree < 157.5 ? "Southeast" :
		degree < 202.5 ? "South" :
		degree < 247.5 ? "Southwest" :
		degree < 292.5 ? "West" : "Northwest";
}