const fetch = require("node-fetch");
const messages = [
  "Stay strong guys!",
  "Take care!",
  "Stay safe!",
  "Stay healthy!",
  "Take care and stay well!",
  "Wash your hands!"
];

module.exports = {
  name: "corona",
  description: "Display the stats for the coronavirus",
  arguments: false,
  usage: "<country/province>",
  default: "alberta",
  async execute(message, arguments) {
    let location = arguments.join(" ").toLowerCase() || "alberta";
    let confirmed = deaths = recovered = 0;

    if (location === "world") {
      const responseString = await fetch("https://coronavirus-tracker-api.herokuapp.com/v2/latest")
        .then(async (response) => await response.text());
      const responseJSON = JSON.parse(responseString).latest;
      confirmed = responseJSON.confirmed;
      deaths = responseJSON.deaths;
      recovered = responseJSON.recovered;
    } else {
      const responseString = await fetch("https://coronavirus-tracker-api.herokuapp.com/v2/locations")
        .then(async (response) => await response.text());
      const responseArray = JSON.parse(responseString).locations;
      for (let index = 0; index < responseArray.length; index++) {
        if (responseArray[index].country.toLowerCase() === location) {
          confirmed += responseArray[index].latest.confirmed;
          deaths += responseArray[index].latest.deaths;
          recovered += responseArray[index].latest.recovered;
        }
      }
      for (let index = 0; index < responseArray.length; index++) {
        if (responseArray[index].province.toLowerCase() === location) {
          confirmed = responseArray[index].latest.confirmed;
          deaths = responseArray[index].latest.deaths;
          recovered = responseArray[index].latest.recovered;
        }
      }
    }

    if (confirmed || deaths || recovered) {
      return message.channel.send({
        embed: {
          color: "#fefefe",
          author: {
            name: location[0].toUpperCase() + location.substring(1)
          },
          fields: [
        		{
        			name: "Confirmed",
        			value: confirmed
        		},
            {
        			name: "Deaths",
        			value: deaths
        		},
            {
        			name: "Recovered",
        			value: recovered
        		}
        	]
        }
      }).then(() => message.channel.send(messages[Math.floor(Math.random() * (messages.length + 1))]));
    }

    return message.reply("Humm, it seems like I don't have data for this country/province. Sorry 😬")
  }
};