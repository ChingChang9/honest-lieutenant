module.exports = {
  name: "disconnect",
  description: "Disconnect me from the voice channel",
  aliases: ["leave", "quit"],
  arguments: false,
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not connected to any voice channel!");
    }
    const connection = await message.guild.voice.channel.join();
    connection.disconnect();
  }
};