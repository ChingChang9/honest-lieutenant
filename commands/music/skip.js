const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");
const servers = require("@/scripts/servers.js");
const { disconnect } = require("@/scripts/play.js");

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
			name: "skip",
			group: "music",
			memberName: "skip",
			aliases: ["s", "sk", "next", "forward"],
			description: "Skips to the next song",
      format: "[#-of-songs-to-skip]",
      guildOnly: true,
      args: [
        {
          key: "skip",
					prompt: "How many songs do you want to skip?",
					type: "integer",
          min: 1,
          default: 1
        }
      ]
		});
  }

  async run(message, { skip }) {
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getItem(message.guild.id, "played");

    if (played === queue.length) {
      servers.getDispatcher(message.guild.id)?.end();
      servers.setDispatcher(message.guild.id, null);
      return disconnect(message);
    }

    votePlay.exec(message, queue, played - 1, played + skip - 1, `Vote on skipping \`${ queue[played - 1].title }\``, "⏩");
  }
};