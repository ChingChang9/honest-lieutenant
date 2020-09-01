const fs = require("fs");
const library = require("../../library.js");
const play = require("./play.js");
const { emptyQueue: emptyQueue } = require("../../config.json");

module.exports = {
  name: "goto",
  description: "Play a specific song in the queue",
  aliases: ["jump"],
  arguments: true,
  usage: "<index-of-song>",
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
      if (arguments[0] === "farewell") {
        return play.execute(message, ["https://www.youtube.com/watch?v=3zbGMcsCtjg"]);
      }
      const index = await parseInt(arguments[0]);
      if (!queue[index - 1]) return message.reply("I can't find the track, maybe the queue has been cleared?");

      if (message.member.id === queue[index - 1].requesterId || message.member.voice.channel.members.size < 3) {
        library.play(message, connection, queue, index - 1);
      } else {
        message.channel.send(`Vote on jumping to \`${ queue[index - 1].title }\``).then(async (message) => {
          await message.react("☑️");
          const collector = await message.createReactionCollector((reaction) => reaction.emoji.name === "☑️", {
            maxUsers: Math.ceil((message.member.voice.channel.members.size - 1) * 2 / 3),
            time: 12000
          });
          collector.on("collect", (reaction, user) => {
            if (user.id === queue[index - 1].requesterId || collector.size >= Math.ceil((message.member.voice.channel.members.size - 1) * 2 / 3)) {
              library.play(message, connection, queue, index - 1);
            }
          });
        });
      }
    });
  }
};