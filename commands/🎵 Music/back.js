const fs = require("fs");
const library = require("../../library.js");
const { emptyQueue } = require("../../config.json");

module.exports = {
  name: "back",
  description: "Play the previous song",
  aliases: ["previous", "prev"],
  arguments: false,
  usage: "[#-of-songs-to-back]",
  default: "1",
  async execute(message, arguments)  {
    if (!message.member.voice.channel) {
      return message.reply("you need to be in a voice channel to use this command!");
    }
    const connection = await message.member.voice.channel.join();
    connection.voice.setSelfDeaf(true);
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      const { guilds } = await JSON.parse(data);
      if (!guilds[message.guild.id]) guilds[message.guild.id] = emptyQueue;
      const { queue, settings } = guilds[message.guild.id];
      if (!queue) message.reply("the queue is empty!");
      const back = await parseInt(arguments[0]) || 1;

      if (message.member.id === queue[settings.played - 1].requesterId || message.member.voice.channel.members.size < 3) {
        if (settings.played <= 1) {
          library.play(message, connection, queue, 0);
        }
        library.play(message, connection, queue, settings.played - back - 1);
      } else {
        message.channel.send(`Vote on rewinding to \`${ queue[settings.played - back - 1].title }\``).then(async (message) => {
          await message.react("⏪");
          const collector = await message.createReactionCollector((reaction) => reaction.emoji.name === "⏪", {
            maxUsers: Math.ceil((message.member.voice.channel.members.size - 1) * 2 / 3) + 1,
            time: 12000
          });
          collector.on("collect", (reaction, user) => {
            if (user.id === queue[settings.played - 1].requesterId || collector.size > Math.ceil((message.member.voice.channel.members.size - 1) * 2 / 3)) {
              if (settings.played <= 1) {
                library.play(message, connection, queue, 0);
              }
              library.play(message, connection, queue, settings.played - back - 1);
            }
          });
        });
      }
    });
  }
};