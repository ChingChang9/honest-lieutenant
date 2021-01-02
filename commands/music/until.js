const Command = require("@/client/command.js");
const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");
const servers = require("@/scripts/servers.js");

module.exports = class UntilCommand extends Command {
  constructor(client) {
    super(client, {
			name: "until",
			group: "music",
			aliases: ["ut", "time"],
			description: "Estimates the time until a song plays",
      format: "<song-index>",
      guildOnly: true,
      arguments: [
        {
          key: "untilIndex",
          parse: untilIndex => parseInt(untilIndex),
          validate: untilIndex => {
            if (isNaN(untilIndex)) return "please enter a number!";
            return true;
          }
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
    ]).then(result => {
      const [queue, played] = result;

      if (untilIndex < played) {
        return message.reply("that song is already played");
      } else if (untilIndex === played) {
        return message.reply("I'm currently playing that song right now, duh 🙄");
      } else if (!queue[untilIndex - 1]) {
        return message.reply("the track doesn't exist");
      }

      let timeLeft = queue[played - 1].duration - Math.floor(dispatcher.streamTime / 1000);
      for (let counter = played; counter < untilIndex - 1; counter++) {
        timeLeft += parseInt(queue[counter].duration);
      }

      message.say(`\`${ formatTime.exec(timeLeft) }\` until \`${ queue[untilIndex - 1].title }\` plays`);
    });
  }
};