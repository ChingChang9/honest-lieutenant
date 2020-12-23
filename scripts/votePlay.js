const play = require("@/scripts/play.js");

module.exports = {
  async exec(message, queue, currentIndex, toIndex, text, emoji) {
    if (!message.member.voice.channel) {
      return message.reply("please only use this when you're in a voice channel");
    }

    const connection = await message.member.voice.channel.join();
    connection.voice.setSelfDeaf(true);

    if (message.member.id === queue[currentIndex].requesterId || message.member.voice.channel.members.size < 3) {
      play.exec(message, connection, queue, toIndex);
    } else {
      message.channel.send(text).then(async (message) => {
        await message.react(emoji);
        const collector = await message.createReactionCollector((reaction) => reaction.emoji.name === "☑️", {
          maxUsers: Math.ceil((message.member.voice.channel.members.size - 1) * 2 / 3) + 1,
          time: 60 * 1000
        });
        collector.on("collect", (reaction, user) => {
          if (user.id === queue[currentIndex].requesterId || collector.size >= Math.ceil((message.member.voice.channel.members.size - 1) * 2 / 3)) {
            play.exec(message, connection, queue, toIndex);
          }
        });
      });
    }
  }
};