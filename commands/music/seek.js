const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const play = require("@/scripts/play.js");

module.exports = class SeekCommand extends Command {
  constructor(client) {
    super(client, {
			name: "seek",
			group: "music",
			memberName: "seek",
			aliases: ["jump"],
			description: "Jump to a timestamp of the currently playing song",
      format: "<timestamp>",
      // TODO: EXAMPLES
      guildOnly: true,
      args: [
        {
          key: "timestamp",
					prompt: "What timestamp do you want to skip to?",
					type: "string",
          parse: (timestamp) => {
            let timeArray = timestamp.split(":");

            if (timeArray.length && timeArray.length <= 3) {
              return timeArray.reduce((accumulator, element, index) => {
                return accumulator + parseInt(element) * 60 ** (timeArray.length - index - 1);
              }, 0);
            } else {
              return NaN;
            }
          }
        }
      ]
		});
  }

  async run(message, { timestamp }) {
    if (!message.member.voice.channel) {
      return message.reply("please only use this when you're in a voice channel");
    }

    if (isNaN(timestamp)) return message.reply("that's an invalid timestamp!");

    const connection = await message.member.voice.channel.join();
    connection.voice.setSelfDeaf(true);

    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getItem(message.guild.id, "played");
    const index = played - 1;

    if (timestamp >= queue[index].duration) {
      return message.reply("the timestamp is past the duration of the song!");
    }

    play.exec(message, connection, queue, index, timestamp);
  }
};