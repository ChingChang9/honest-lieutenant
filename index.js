require("module-alias/register");
const fs = require("fs");
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const path = require("path");
const sqlite = require("sqlite");
const { emptyQueue, discordToken } = require("@/config.json");
const prefixless = require("@/prefixless.js");
const firebase = require("@/scripts/firebase.js");
const axios = require("axios");

const client = new CommandoClient({
  commandPrefix: ".",
  owner: "371129637725798400",
  invite: "https://discordapp.com/invite/Bu8rPza",
  disableEveryone: true
});

sqlite.open({
  filename: path.join(__dirname, "settings.sqlite3"),
  driver: sqlite.Database
}).then((db) => client.setProvider(new SQLiteProvider(db)));

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["utility", "⚙️ Utility"],
    ["music", "🎵 Music"],
    ["meme", "🙃 Meme"],
    ["picture", "🖼️ Picture"],
    ["other", "❓ Other"]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    ping: false,
    prefix: false,
    unknownCommand: false
  })
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  client.user.setActivity("with myself | .help");
  const json = {
    "name": "blep",
    "description": "Send a random adorable animal photo",
    "options": [
      {
        "name": "animal",
        "description": "The type of animal",
        "type": 3,
        "required": true,
        "choices": [
          {
            "name": "Dog",
            "value": "animal_dog"
          },
          {
            "name": "Cat",
            "value": "animal_dog"
          },
          {
            "name": "Penguin",
            "value": "animal_penguin"
          }
        ]
      },
      {
        "name": "only_smol",
        "description": "Whether to show only baby animals",
        "type": 5,
        "required": false
      }
    ]
  }
  axios.post("https://discord.com/api/v8/applications/668301556185300993/commands", json, {
    headers: {
      Authorization: `Bot ${ discordToken }`
    }
  });
  console.log(`Logged in as ${ client.user.tag }!`);
});

client.on("guildCreate", (guild) => {
	firebase.updateValue(guild.id, emptyQueue);
});

client.on("guildDelete", (guild) => {
	firebase.database.ref(guild.id).remove();
});

client.on("message", async (message) => {
  if (!message.author.bot && !message.content.startsWith(message.guild.commandPrefix)) {
    prefixless.run(message);
  }
});

client.on("error", (error) => console.error("The websocket connection encountered an error: ", error));
process.on("unhandledRejection", (error) => console.error("Uncaught Promise Rejection", error));

client.login(discordToken);