const { emptyQueue } = require("@/config.json");
const firebase = require("@/scripts/firebase.js");

module.exports = {
  name: "empty",
  description: "Clear all entries in the queue",
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      await firebase.updateValue(message.guild.id, emptyQueue);
    } else {
      const connection = await message.guild.voice.channel.join();
      if (!connection.player.dispatcher) {
        await firebase.updateValue(message.guild.id, emptyQueue);
      } else {
        const played = await firebase.getPlayed(message.guild.id);
        const queue = await firebase.database.ref(`${ message.guild.id }/queue`).once("value");
        let newQueue = {};
        newQueue[Object.keys(queue.val())[played - 1]] = Object.values(queue.val())[played - 1];
        await firebase.updateValue(`${ message.guild.id }/queue`, newQueue);
        await firebase.updateValue(`${ message.guild.id }/settings/played`, 1);
      }
    }
    message.react("👍🏽");
  }
};