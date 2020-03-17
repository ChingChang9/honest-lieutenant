module.exports = {
  name: "resume",
  description: "Resume the music in the voice channel",
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in the voice channel!");
    }
    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I'm wasn't playing anything!");
    }
    connection.player.dispatcher.resume();
  }
};