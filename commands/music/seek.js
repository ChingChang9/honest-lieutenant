const Command = require("@/client/command.js");
const firebase = require("@/scripts/firebase.js");
const play = require("@/scripts/play.js");

module.exports = class SeekCommand extends Command {
  constructor(client) {
    super(client, {
			name: "seek",
			group: "music",
			aliases: ["jump"],
			description: "Jumps to a timestamp of the current song",
      format: "<timestamp>",
      examples: [
        {
          input: "1:20",
          explanation: "Jumps to 1:20 of the song"
        },
        {
          input: "80",
          explanation: "Also jumps to 1:20 of the song"
        },
        {
          input: "0:80",
          explanation: "Once again jumps to 1:20 of the song"
        }
      ],
      guildOnly: true,
      arguments: [
        {
          key: "timestamp",
          parse: timestamp => {
            let timeArray = timestamp.split(":");

            if (timeArray.length && timeArray.length <= 3) {
              return timeArray.reduce((accumulator, element, index) => {
                return accumulator + parseInt(element) * 60 ** (timeArray.length - index - 1);
              }, 0);
            } else {
              return NaN;
            }
          },
          validate: (timestamp, message) => {
            if (!message.member.voice.channel) return "please only use this when you're in a voice channel";
            if (isNaN(timestamp)) return "that's an invalid timestamp!";

            return true;
          }
        }
      ]
		});
  }

  run(message, { timestamp }) {
    Promise.all([
      firebase.getQueue(message.guild.id),
      firebase.getItem(message.guild.id, "played"),
      message.member.voice.channel.join().then(connection => {
        connection.voice.setSelfDeaf(true);
        return connection;
      })
    ]).then(result => {
      const [queue, played, connection] = result;
      const index = played - 1;

      if (timestamp >= queue[index].duration) {
        return message.reply("the timestamp is past the duration of the song!");
      }

      play.exec(message, connection, queue, index, timestamp);
    });
  }
};