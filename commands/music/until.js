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

  run(message, { untilIndex }) {
    const dispatcher = servers.getDispatcher(message.guild.id);
    if (!dispatcher) {
      return message.reply("I'm not playing anything!");
    }

    Promise.all([
      firebase.getQueue(message.guild.id),
      firebase.getItem(message.guild.id, "played")
    ]).then((result) => {
      const [queue, played] = result;

      if (untilIndex < played) {
        return message.reply("that song is already played");
      } else if (untilIndex === played) {
        return message.reply("I'm currently playing that song right now, duh 🙄");
      }

      let timeLeft = queue[played - 1].duration - Math.floor(dispatcher.streamTime / 1000);
      for (let counter = played; counter < untilIndex - 1; counter++) {
        timeLeft += parseInt(queue[counter].duration);
      }

      message.say(`\`${ formatTime.exec(timeLeft) }\` until \`${ queue[untilIndex - 1].title }\` plays`);
    });
  }
};