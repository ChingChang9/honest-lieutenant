const fs = require("fs");
const ytdl = require("ytdl-core-discord");
const { google } = require("googleapis");
const { emptyQueue, youtubeAuth } = require("../../config.json");
const youtube = google.youtube({
  version: "v3",
  auth: youtubeAuth
});
const library = require("../../library.js");
const forbiddenWords = [
  "taylor swift",
  "nightcore",
  "gangnam style"
];

module.exports = {
  name: "play",
  description: "Queue music in the voice channel",
  aliases: ["add", "p"],
  arguments: true,
  usage: "<song-name/link-to-the-song>",
  async execute(message, arguments) {
    if (!message.member.voice.channel) {
      return message.reply("you need to be in a voice channel to queue music!");
    }

    let songUrl = arguments[0];
    if (!arguments[0].startsWith("http")) {
      const result = await youtube.search.list({
        part: "snippet",
        q: arguments.join(" "),
        type: "video",
        maxResults: 1
      });
      songUrl = `https://www.youtube.com/watch?v=${ result.data.items[0].id.videoId }`;
    }
    const songInfo = await ytdl.getInfo(songUrl).catch(() => message.reply("the video link is invalid"));
    const trash = forbiddenWords.some((forbiddenWord) => {
      if (songInfo.title.toLowerCase().includes(forbiddenWord)) return forbiddenWord
    });
    if (message.author.id === "180472559148597249" && trash) return message.reply(`no ${ trash } please!`);

    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      let { guilds } = await JSON.parse(data);
      if (!guilds[message.guild.id]) guilds[message.guild.id] = emptyQueue;
      let { queue } = guilds[message.guild.id];
      queue.push({
        title: songInfo.title,
        videoUrl: songInfo.video_url,
        thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
        channel: songInfo.author.name,
        channelUrl: songInfo.author.channel_url,
        duration: songInfo.length_seconds,
        requester: message.member.displayName,
        requesterId: message.member.id
      });
      guilds[message.guild.id].queue = queue;
      await fs.writeFile("./assets/queue.json", `{"guilds":${ JSON.stringify(guilds) }}`, (error) => {
        if (error) return console.log(error);
        message.channel.send(`Enqueued \`${ songInfo.title }\` at position \`${ queue.length }\``)
      });

      const connection = await message.member.voice.channel.join();
      connection.voice.setSelfDeaf(true);
      if (!connection.player.dispatcher) {
        library.play(message, connection, queue, queue.length - 1);
      }
    });
  }
};