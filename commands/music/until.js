const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");
const servers = require("@/scripts/servers.js");

module.exports = class UntilCommand extends Command {
  constructor(client) {
    super(client, {
			name: "until",
			group: "music",
			memberName: "until",
			aliases: ["ut", "time"],
			description: "Estimates the time until a song plays",
      format: "<song-index>",
      guildOnly: true,
      args: [
        {
          key: "untilIndex",
					prompt: "What is the index of the song your want to look up?",
					type: "integer",
          min: 1,
        }
      ]
		});
  }

  async run(message, { untilIndex }) {
    const dispatcher = await servers.getDispatcher(message.guild.id);
    if (!dispatcher) {
      return message.reply("I'm not playing anything!");
    }

    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getItem(message.guild.id, "played");
    const index = played - 1;

    if (untilIndex < index + 1) {
      return message.reply("that song is already played");
    } else if (untilIndex === index + 1) {
      return message.reply("I'm currently playing that song right now, duh 🙄");
    }

    let timeLeft = queue[index].duration - Math.floor(dispatcher.streamTime / 1000);
    for (let counter = index + 1; counter < untilIndex - 1; counter++) {
      timeLeft += parseInt(queue[counter].duration);
    }

    message.channel.send(`\`${ formatTime.exec(timeLeft) }\` until \`${ queue[untilIndex - 1].title }\` plays`);
  }
};