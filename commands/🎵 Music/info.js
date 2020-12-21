const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");

module.exports = {
  name: "info",
  description: "Provide information on the current song",
  aliases: ["np", "current"],
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in a voice channel!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I am not playing anything!");
    }
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);
    const seekTimestamp = await firebase.database.ref(`${ message.guild.id }/settings/seek`).once("value");
    const index = played - 1;

    const runTimeTimestamp = Math.floor(connection.player.dispatcher.streamTime / 1000) + seekTimestamp.val();
    const runTime = formatTime.exec(runTimeTimestamp);
    const duration = formatTime.exec(queue[index].duration);
    const ratio = Math.floor(runTimeTimestamp / queue[index].duration * 10);
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
            value: played,
            inline: true
          }
        ],
        footer: {
          text: "Ching Chang © 2020 All Rights Reserved",
          icon_url: "attachment://icon.jpg"
        }
      }
    });
  }
};