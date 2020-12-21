const fs = require("fs");
const ytdl = require("ytdl-core");
const formatTime = require("@/scripts/formatTime.js");
const firebase = require("@/scripts/firebase.js");
let timeouts = {};

module.exports = {
  async exec(message, connection, queue, index, seekTimestamp = 0) {
    const dispatcher = await playSong(connection, queue, index, seekTimestamp);

    dispatcher.on("start", async () => {
      const repeat = await firebase.database.ref(`${ message.guild.id }/settings/repeat`).once("value");
      if (!repeat.val() && !seekTimestamp) message.channel.send({
        embed: {
          color: "#fefefe",
          author: {
            name: queue[index].channel,
            url: queue[index].channelUrl
          },
          title: queue[index].title,
          url: queue[index].videoUrl,
          thumbnail: {
            url: queue[index].thumbnail
          },
          fields: [
            {
              name: "Duration",
              value: queue[index].duration === "0" ? "Live" : formatTime.exec(queue[index].duration),
              inline: true
            },
            {
              name: "Requested by",
              value: queue[index].requester,
              inline: true
            },
            {
              name: "Index",
              value: index + 1,
              inline: true
            }
          ],
          footer: {
            text: "Ching Chang © 2020 All Rights Reserved",
            icon_url: "attachment://icon.jpg"
          }
        }
      });

      firebase.updateValue(`${ message.guild.id }/settings`, {
        played: index + 1,
        seek: seekTimestamp
      });

      if (timeouts[connection.channel.guild.id]) {
        timeouts[connection.channel.guild.id].close();
        timeouts[connection.channel.guild.id] = null;
      }
    });
    dispatcher.on("finish", async () => {
      const repeat = await firebase.database.ref(`${ message.guild.id }/settings/repeat`).once("value");
      const queue = await firebase.getQueue(message.guild.id);

      if (repeat.val()) return this.exec(message, connection, queue, index);
      if (index + 1 === queue.length) {
        dispatcher.destroy();
        return disconnect(message, connection);
      }
      this.exec(message, connection, queue, ++index);
    });
    dispatcher.on("error", (error) => {
      console.log("Error playing the song", error);
      message.reply("there was an error playing this song :(");
    });
  },
  clearTimeout(guildId) {
    timeouts[guildId] = null;
  }
};

async function playSong(connection, queue, index, seekTimestamp) {
  return connection.play(
    await ytdl(queue[index].videoUrl, {
      filter: "audio",
      highWaterMark: 256 * 1024
    }), {
      seek: seekTimestamp,
      volume: false,
      bitrate: 64,
      highWaterMark: 1
    }
  );
}

function disconnect(message, connection) {
  timeouts[connection.channel.guild.id] = setTimeout(() => {
    timeouts[connection.channel.guild.id] = null;
    if (!message.guild.voice.channel) return;
    const disconnectMessages = [
      "Ight imma head out",
      "Time to banana split out of this awkwardness",
      "Let me strawberry jam outta here",
      "Anyway~ I gotta wake up early tomorrow, so... yeah",
      "Alright, cya",
      `For LOHS TV, I am ${ message.guild.members.cache.get("668301556185300993").displayName }, and just remember: BE LEGENDARY!`
    ];
    message.channel.send(disconnectMessages[Math.floor(Math.random() * (disconnectMessages.length))]).then(() => {
      setTimeout(() => {
        connection.disconnect();
      }, 3 * 1000);
    });
  }, 4 * 60 * 1000);
}