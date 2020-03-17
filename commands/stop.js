module.exports = {
  name: "stop",
  description: "Stop the music in the voice channel",
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not playing anything!");
    }
    const connection = await message.guild.voice.channel.join();
    connection.player.dispatcher.destroy();
  }
};