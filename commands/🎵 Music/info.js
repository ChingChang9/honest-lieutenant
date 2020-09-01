const fs = require("fs");
const library = require("../../library.js");

module.exports = {
  name: "info",
  description: "Provide information on the current song",
  aliases: ["np", "current"],
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in the voice channel!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I am not playing anything!");
    }

    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      const { guilds } = await JSON.parse(data);
      const { queue, settings } = guilds[message.guild.id];
      const index = settings.played - 1;

      const runTime = library.formatTime(Math.floor(connection.player.dispatcher.streamTime / 1000));
      const duration = library.formatTime(queue[index].duration);
      const ratio = Math.floor(connection.player.dispatcher.streamTime / 1000 / queue[index].duration * 10);
      message.channel.send({
        embed: {
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
          description: `${ runTime } ${ "▬".repeat(ratio) }🔘${ "▬".repeat((9 - ratio)) } ${ duration }`,
          fields: [
            {
              name: "Requested by",
              value: queue[index].requester,
              inline: true
            },
            {
              name: "Index",
              value: settings.played,
              inline: true
            }
          ],
          footer: {
            text: "Ching Chang © 2020 All Rights Reserved",
            icon_url: "attachment://icon.jpg"
          }
        }
      });
    });
  }
};