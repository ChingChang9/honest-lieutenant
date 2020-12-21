const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");

module.exports = {
  name: "until",
  description: "Estimate the time until a certain can be played",
  aliases: ["time"],
  arguments: true,
  usage: "<index-of-song>",
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in a voice channel!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I'm not playing anything!");
    }

    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);
    const index = played - 1;
    const untilIndex = parseInt(arguments[0])

    if (untilIndex < index + 1) {
      return message.reply("that song is already played");
    } else if (untilIndex === index + 1) {
      return message.reply("I'm currently playing that song right now, duh 🙄");
    }

    let timeLeft = queue[index].duration - Math.floor(connection.player.dispatcher.streamTime / 1000);
    for (let counter = index + 1; counter < untilIndex - 1; counter++) {
      timeLeft += parseInt(queue[counter].duration);
    }

    message.channel.send(`\`${ formatTime.exec(timeLeft) }\` until \`${ queue[untilIndex - 1].title }\` plays`);
  }
};