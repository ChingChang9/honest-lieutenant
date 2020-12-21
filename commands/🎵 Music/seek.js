const firebase = require("@/scripts/firebase.js");
const play = require("@/scripts/play.js");

module.exports = {
  name: "seek",
  description: "Jump to a timestamp of the currently playing song",
  aliases: ["jump"],
  arguments: true,
  usage: "<timestamp>",
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in a voice channel!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I am not playing anything!");
    }

    const timestamp = getTimestamp(arguments[0]);
    if (isNaN(timestamp)) return message.reply("that's an invalid timestamp!");

    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);
    const index = played - 1;

    if (timestamp >= queue[index].duration) {
      return message.reply("the timestamp is past the duration of the song!");
    }

    play.exec(message, connection, queue, index, timestamp);
  }
};

function getTimestamp(timeString) {
  timeArray = timeString.split(":");

  if (timeArray.length === 1) {
    return parseInt(timeString);
  } else if (timeArray.length === 2) {
    return parseInt(timeArray[0] * 60) + parseInt(timeArray[1]);
  } else if (timeArray.length === 3) {
    return parseInt(timeArray[0] * 3600) + parseInt(timeArray[1] * 60) + parseInt(timeArray[2]);
  } else {
    return NaN;
  }
}