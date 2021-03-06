const Command = require("@/client/command.js");
const request = require("@/workers/request.js");
const cheerio = require("cheerio");

const messages = [
	"Stay strong!",
	"Take care!",
	"Stay safe!",
	"Stay healthy!",
	"Take care and stay well!",
	"Wash your hands!",
	"Wear your mask!"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "covid",
			group: "other",
			aliases: ["corona", "coronavirus"],
			description: "Display the coronavirus stats in Edmonton"
		});
	}

	async run(message) {
		const html = await request("https://www.alberta.ca/covid-19-alberta-data.aspx").then(response => response.data);
		const $ = await cheerio.load(html);
		const table = $(".goa-table > table > tbody").children().eq(3).children();
		const confirmed = table.eq(1).text();
		const active = table.eq(2).text();
		const recovered = table.eq(3).text();
		const hospital = table.eq(4).text();
		const intensive = table.eq(5).text();
		const deaths = table.eq(6).text();
		const description = $("#goa-grid28054 .goa-callout ul li").text().replace(".", ".\n");

		message.embed({
			author: {
				name: "Cases in Edmonton",
				url: "https://www.alberta.ca/covid-19-alberta-data.aspx#goa-grid28054"
			},
			description,
			fields: [
				{
					name: "Confirmed",
					value: confirmed,
					inline: true
				},
				{
					name: "Active",
					value: active,
					inline: true
				},
				{
					name: "Recovered",
					value: recovered,
					inline: true
				},
				{
					name: "In Hospital",
					value: hospital,
					inline: true
				},
				{
					name: "In Intensive Care",
					value: intensive,
					inline: true
				},
				{
					name: "Deaths",
					value: deaths,
					inline: true
				}
			]
		});
		message.say(messages[Math.floor(Math.random() * messages.length)]);
	}
};