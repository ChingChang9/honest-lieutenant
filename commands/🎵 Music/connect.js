module.exports = {
  name: "connect",
  description: "Connect to the voice channel",
  aliases: ["join"],
  arguments: false,
  execute(message, arguments) {
    if (!message.member.voice.channel) {
      return message.reply("you need to be in a voice channel to use this command!");
    }

    message.member.voice.channel.join();
  }
};