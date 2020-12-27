const { Command } = require("discord.js-commando");
const fs = require("fs");
const axios = require("axios");
const firebase = require("@/scripts/firebase.js");
const { ksoftAuth } = require("@/config.json");
const translate = require("@/scripts/translate.js");
const servers = require("@/scripts/servers.js");

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
			name: "lyrics",
			group: "music",
			memberName: "lyrics",
			aliases: ["ly"],
			description: "Displays the lyrics of the current song",
      format: "[original/translate]",
      examples: [
        "` (Displays the lyrics in its language)",
        " translate` (Displays the English translation of the lyrics)"
      ],
      guildOnly: true,
      args: [
        {
          key: "language",
					prompt: "Should I translate the song?",
					type: "string",
          oneOf: ["original", "translate"],
          default: "original"
        }
      ]
		});
  }

  async run(message, { language }) {
    if (!servers.getDispatcher(message.guild.id)) {
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

    if (language === "translate") {
      lyrics = await translate.exec(lyrics);
    }

    let start = 0
    let end = 0;
    while (end < lyrics.length) {
      end = start + 2048;
      if (lyrics.length > end) {
        while (lyrics[--end] !== "\n") {}
      }
      message.embed({
        color: "#fefefe",
        title: start === 0 ? songTitle : null,
        url: start === 0 ? videoUrl : null,
        thumbnail: start === 0 ? { url: thumbnailUrl } : null,
        description: lyrics.slice(start, end),
        footer: end >= lyrics.length ? { text: "Lyrics provided by KSoft.Si" } : null
      });
      start = end + 1
    }
  }
};

async function getVideoInfo(message) {
  const queue = await firebase.getQueue(message.guild.id);
  const played = await firebase.getItem(message.guild.id, "played");
  const index = played - 1;

  return [queue[index].title, queue[index].videoUrl];
}