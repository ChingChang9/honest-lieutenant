const fs = require("fs");
const ytdl = require("ytdl-core-discord");
const axios = require("axios");

module.exports = {
  async play(message, connection, queue, index) {
    const dispatcher = await connection.play(await ytdl(queue[index].videoUrl), {
      type: "opus",
      volume: false,
      filter: "audioonly",
      highWaterMark: 1024 * 1024 * 8
    });
    dispatcher.on("start", () => {
      fs.readFile("./assets/queue.json", async (error, data) => {
        if (error) return console.log(error);

        let { guilds } = await JSON.parse(data);
        guilds[message.guild.id].settings.played = index + 1;
        fs.writeFile("./assets/queue.json", `{"guilds":${ JSON.stringify(guilds) }}`, (error) => {
          if (error) return console.log(error);
        });

        const { queue, settings } = guilds[message.guild.id];
        if (!settings.repeat) message.channel.send({
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
                value: `${ queue[index].duration < 36000 ? "0" : "" }${ Math.floor(queue[index].duration / 3600) }:${
                queue[index].duration % 3600 < 600 ? "0" : "" }${ Math.floor(queue[index].duration % 3600 / 60) }:${
                queue[index].duration % 60 < 10 ? "0" : "" }${ queue[index].duration % 60 }`,
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
      });
    });
    dispatcher.on("finish", () => {
      fs.readFile("./assets/queue.json", async (error, data) => {
        if (error) return console.log(error);

        const { guilds } = await JSON.parse(data);
        const { queue, settings } = await guilds[message.guild.id];
        if (settings.repeat) return this.play(message, connection, queue, index);
        if (index + 1 === queue.length) return dispatcher.destroy();
        this.play(message, connection, queue, ++index);
      });
    });
    dispatcher.on("error", (error) => message.reply("there was an error playing this song"));
  },
  wordWrap(context, text, x, y, maxWidth, maxHeight, shadow = false) {
    let words = text.split(" ");
    context.font = context.font.replace(/\d+px/, (parseInt(context.font.match(/\d+px/)) + 2) + "px");
    do {
      context.font = context.font.replace(/\d+px/, (parseInt(context.font.match(/\d+px/)) - 2) + "px");
      textLines = [];
      testLine = "";
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        if (context.measureText(testLine + words[wordIndex]).width > maxWidth) {
          textLines.push(testLine);
          testLine = "";
        }
        testLine += `${ words[wordIndex] } `;
      }
      textLines.push(testLine.trim());
    } while ((parseInt(context.font.match(/\d+px/)) * 2 * (textLines.length - 1) > maxHeight));

    y = y + maxHeight / 2 - (textLines.length - 1) * parseInt(context.font.match(/\d+px/)) / 2;
    for (let lineIndex = 0; lineIndex < textLines.length; lineIndex++) {
      if (shadow) context.strokeText(textLines[lineIndex], x + (maxWidth - context.measureText(textLines[lineIndex]).width) / 2, y);
      context.fillText(textLines[lineIndex], x + (maxWidth - context.measureText(textLines[lineIndex]).width) / 2, y);
      y += parseInt(context.font.match(/\d+px/));
    }
  },
  async translate(originalText) {
    const language = await axios.get("https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20200413T020422Z.e5c12f79700e76fe.41811567ebcd2a3f09222ec588669064cf0d47df", {
      params: {
        text: originalText
      }
    }).then((response) => response.data);
    const translatedText = await axios.get("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200413T020422Z.e5c12f79700e76fe.41811567ebcd2a3f09222ec588669064cf0d47df", {
      params: {
        text: originalText,
        lang: `${ language.lang }-en`
      }
    }).then((response) => response.data.text[0]);
    return translatedText;
  }
};