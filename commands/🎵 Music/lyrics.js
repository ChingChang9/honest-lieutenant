const fs = require("fs");
const getArtistTitle = require("get-artist-title");
const axios = require("axios");
const cheerio = require("cheerio");
const library = require("../../library.js");

module.exports = {
  name: "lyrics",
  description: "Get the lyrics of the current song",
  arguments: false,
  usage: "<original/translate>",
  default: "original",
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not in the voice channel!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I am not playing anything!");
    }

    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      const { guilds } = await JSON.parse(data);
      const { queue, settings } = guilds[message.guild.id];
      const index = settings.played - 1;
      let [ artist, title ] = await getArtistTitle(queue[index].title, {
        defaultArtist: queue[index].channel
      });
      title = await title.replace(/[[(].*?[)\]]/g, "").trim();

      const geniusUrls = await axios("http://genius.com/api/search/song", {
        params: {
          q: title
        }
      }).then((response) => response.data.response.sections[0].hits);

      if (!geniusUrls.length) return message.reply("sorry, I can't find the lyrics for this song 😬")

      let geniusUrl = geniusUrls[0].result.url;
      for (let songIndex = 0; songIndex < geniusUrls.length; songIndex++) {
        if (geniusUrls[songIndex].result.primary_artist.name === artist) {
          geniusUrl = geniusUrls[songIndex].result.url;
        }
      }

      const html = await axios(geniusUrl).then((response) => response.data);
      const $ = await cheerio.load(html);
      title = await $("h1.header_with_cover_art-primary_info-title").text();
      let lyrics = await $(".lyrics").text().trim();
      const thumbnailUrl = await $("img.cover_art-image").attr("src");

      if (!lyrics) return setTimeout(function() {
        this.this.execute(message, arguments);
      }, 1000);

      if (arguments[0] === "translate") {
        lyrics = await library.translate(lyrics);
      }

      message.channel.send({
        embed: {
          color: "#fefefe",
          title: `${ title }`,
          url: geniusUrl,
          thumbnail: {
            url: thumbnailUrl
          },
          description: lyrics.slice(0, 2048)
        }
      });
      for (let lyricsLength = 2049; lyricsLength < lyrics.length; lyricsLength += 2048) {
        message.channel.send({
          embed: {
            color: "#fefefe",
            description: lyrics.slice(lyricsLength - 1, lyricsLength + 2047)
          }
        });
      }
    });
  }
};