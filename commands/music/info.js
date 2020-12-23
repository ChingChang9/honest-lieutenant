const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");
const servers = require("@/scripts/servers.js");

module.exports = class InfoCommand extends Command {
  constructor(client) {
    super(client, {
			name: "info",
			group: "music",
			memberName: "info",
			aliases: ["np", "current"],
			description: "Provide information on the current song",
      guildOnly: true
		});
  }

  async run(message) {
    const dispatcher = servers.getDispatcher(message.guild.id);
    if (!dispatcher) {
      return message.reply("I am not playing anything!");
    }
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getItem(message.guild.id, "played");
    const index = played - 1;

    const [elapsed, duration, ratio] = await getInfo(message.guild.id, dispatcher, queue[index].duration);

    message.embed({
      color: "#fefefe",
      author: {
        name: queue[index].channel,
        url: queue[index].channelUrl
      },
      title: queue[index].title,
      url: queue[index].videoUrl,
      thumbnail: {
        url: queue[index].thumbnail
      },
      description: `${ elapsed } ${ "▬".repeat(ratio) }🔘${ "▬".repeat((9 - ratio)) } ${ duration }`,
      fields: [
        {
          name: "Requested by",
          value: queue[index].requester,
          inline: true
        },
        {
          name: "Index",
          value: played,
          inline: true
        }
      ],
      footer: {
        text: "Ching Chang © 2020 All Rights Reserved",
        icon_url: "attachment://icon.jpg"
      }
    });
  }
};

async function getInfo(guildId, dispatcher, duration) {
  const seekTimestamp = await firebase.getItem(guildId, "seek");
  const elapsedTimestamp = Math.floor(dispatcher.streamTime / 1000) + seekTimestamp;
  const elapsed = formatTime.exec(elapsedTimestamp);
  const ratio = duration === "0" ? 9 : Math.floor(elapsedTimestamp / duration * 10);

  return [elapsed, formatTime.exec(duration), ratio];
}