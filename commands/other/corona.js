const { Command } = require("discord.js-commando");
const axios = require("axios");
const cheerio = require("cheerio");
const messages = [
  "Stay strong guys!",
  "Take care!",
  "Stay safe!",
  "Stay healthy!",
  "Take care and stay well!",
  "Wash your hands!",
  "Wear your mask!"
];

module.exports = class CoronaCommand extends Command {
  constructor(client) {
		super(client, {
			name: "corona",
			group: "other",
			memberName: "corona",
      aliases: ["covid", "coronavirus", "virus", "stats"],
			description: "Displays the coronavirus stats in Edmonton"
		});
	}

  async run(message) {
    const html = await axios("https://www.alberta.ca/covid-19-alberta-data.aspx").then((response) => response.data);
    const $ = await cheerio.load(html);
    const table = $(".goa-table > table > tbody").children().eq(3).children();
    const confirmed = table.eq(1).text();
    const active = table.eq(2).text();
    const recovered = table.eq(3).text();
    const hospital = table.eq(4).text();
    const intensive = table.eq(5).text();
    const deaths = table.eq(6).text();
    const description = $("#goa-grid28054").children().eq(-2).text();

    message.embed({
      color: "#fefefe",
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
    }).then(() => message.say(messages[Math.floor(Math.random() * messages.length)]));
  }
};