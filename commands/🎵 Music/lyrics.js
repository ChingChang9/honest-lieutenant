const fs = require("fs");
const getArtistTitle = require("get-artist-title");
const fetch = require("node-fetch");
const l = require("better-lyric-get");

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
      const [ artist, title ] = await getArtistTitle(queue[index].title, {
        defaultArtist: queue[index].channel
      });
      l.get(artist, title, async (error, response) => {
        if (error) return message.reply("sorry, I couldn't find the lyrics for this song. 😬");

        const lyrics = response.lyrics;

        if (arguments[0] === "translate") {
          let language = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20200413T020422Z.e5c12f79700e76fe.41811567ebcd2a3f09222ec588669064cf0d47df&text=${ lyrics }`);
          language = JSON.parse(await language.text());
          if (language.lang !== "en") {
            lyrics = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200413T020422Z.e5c12f79700e76fe.41811567ebcd2a3f09222ec588669064cf0d47df&text=${ lyrics }&lang=${ language.lang }-en`);
            lyrics = JSON.parse(await lyrics.text());
            lyrics = lyrics.text.join("");
          }
        }

        message.channel.send({
          embed: {
            color: "#fefefe",
            title: `${ title }\n${ artist }`,
            description: lyrics.slice(0, 2048)
          }
        });
        if (lyrics.length > 2049) {
          message.channel.send({
            embed: {
              color: "#fefefe",
              description: lyrics.slice(2048, 4096)
            }
          });
        }
        if (lyrics.length > 4097) {
          message.channel.send({
            embed: {
              color: "#fefefe",
              description: lyrics.slice(4096, 6144)
            }
          });
        }
      });
    });
  }
};