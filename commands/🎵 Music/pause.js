module.exports = {
  name: "pause",
  description: "Pause the music in the voice channel",
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in a voice channel!");
    }
    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I'm not playing anything!");
    }
    connection.player.dispatcher.pause();
  }
};