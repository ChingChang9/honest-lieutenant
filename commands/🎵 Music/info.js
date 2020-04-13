const fs = require("fs");

module.exports = {
  name: "info",
  description: "Provide information on the current song",
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in the voice channel!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I am not playing anything!");
    }

    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      const { queue, settings } = JSON.parse(data);
      let index = settings.played - 1;
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
          fields: [
            {
              name: "Duration",
              value: `${ queue[index].duration < 36000 ? "0" : "" }${ Math.floor(queue[index].duration / 3600) }:${
              queue[index].duration % 3600 < 600 ? "0" : "" }${ Math.floor(queue[index].duration % 3600 / 60) }:${
              queue[index].duration % 60 < 10 ? "0" : "" }${ queue[index].duration % 60 }`,
              inline: true
            },
            {
              name: "Requested by",
              value: message.member.nickname || message.author.username,
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