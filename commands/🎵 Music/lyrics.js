const fs = require("fs");
const getArtistTitle = require("get-artist-title");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const Genius = require("genius-api");
const genius = new Genius("1LN7orAOLwZ834934gh9A_gXOdCCGwJkCELbxlXfjdGQTB43HlNLENlKneEVbrA1")

module.exports = {
  name: "lyrics",
  description: "Get the lyrics of the current song",
  arguments: false,
  execute(message, arguments) {
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      const { queue, settings } = JSON.parse(data);
      let index = settings.played - 1;
      const [ artist, title ] = await getArtistTitle(queue[index].title);

      Genius.prototype.getArtistIdByName = async function getArtistIdByName(artist) {
        const response = await this.search(artist);
        for (let index = 0; index < response.hits.length; index += 1) {
          if (response.hits[index].type === "song" &&
          response.hits[index].result.primary_artist.name.toLowerCase() === artist.toLowerCase()) {
            const songInfo = await response.hits[index].result;
            return songInfo.primary_artist.id;
          }
        }
        return message.reply("sorry, I couldn't find the lyrics for this song. 😬");
      }
      const artistId = await genius.getArtistIdByName(artist)
      const response = await genius.songsByArtist(artistId, {
        per_page: 50,
        sort: "popularity",
      });
      const { songs } = response;
      for (let counter = 0; counter < songs.length; counter++) {
        if (title.includes(songs[counter].title)) {
          const htmlResponse = await fetch(songs[counter].url);
          const lyricsHtml = await htmlResponse.text();
          const $ = await cheerio.load(lyricsHtml);
          const lyrics = await $(".lyrics").text();
          return message.channel.send({
            embed: {
              color: "#fefefe",
              title: `${ songs[counter].title }\n${ songs[counter].primary_artist.name }`,
              thumbnail: {
                url: songs[counter].header_image_url
              },
              description: lyrics.slice(0, 2048)
            }
          });
        }
      }
    });
  }
};