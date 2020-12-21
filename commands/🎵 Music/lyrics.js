const fs = require("fs");
const axios = require("axios");
const firebase = require("@/scripts/firebase.js");
const { ksoftAuth } = require("@/config.json");
const translate = require("@/scripts/translate.js");

module.exports = {
  name: "lyrics",
  description: "Get the lyrics of the current song",
  arguments: false,
  usage: "[original/translate]",
  default: "original",
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in a voice channel!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I am not playing anything!");
    }

    const [videoTitle, videoUrl] = await getVideoInfo(message);

    const data = await axios("https://api.ksoft.si/lyrics/search", {
      headers: {
        Authorization: `Bearer ${ ksoftAuth }`
      },
      params: {
        q: videoTitle,
        limit: 1
      }
    }).then((response) => response.data.data[0]);

    let lyrics = data.lyrics;
    const songTitle = data.name;
    const artist = data.artist;
    const thumbnailUrl = data.album_art;

    if (arguments[0] === "translate") {
      lyrics = await translate.exec(lyrics);
    }

    let start = 0
    let end = 0;
    while (end < lyrics.length) {
      end = start + 2048;
      if (lyrics.length > end) {
        while (lyrics[--end] !== "\n") {}
      }
      message.channel.send({
        embed: {
          color: "#fefefe",
          title: start === 0 ? songTitle : null,
          url: start === 0 ? videoUrl : null,
          thumbnail: start === 0 ? { url: thumbnailUrl } : null,
          description: lyrics.slice(start, end),
          footer: end >= lyrics.length ? { text: "Lyrics provided by KSoft.Si" } : null
        }
      });
      start = end + 1
    }
  }
};

async function getVideoInfo(message) {
  const queue = await firebase.getQueue(message.guild.id);
  const played = await firebase.getPlayed(message.guild.id);
  const index = played - 1;

  return [queue[index].title, queue[index].videoUrl];
}