const ytdl = require("ytdl-core");
const { google } = require("googleapis");
const scrapePlaylist = require("youtube-playlist-scraper");
const { youtubeAuth } = require("@/config.json");
const addSong = require("@/scripts/addSong.js");
const addPlaylist = require("@/scripts/addPlaylist.js");

const youtube = google.youtube({
  version: "v3",
  auth: youtubeAuth
});
const trashes = [
  "100 gecs",
  "ppcocaine"
];

module.exports = {
  name: "play",
  description: "Queue music in the voice channel",
  aliases: ["add", "p"],
  arguments: true,
  usage: "<name/link/playlist> [#-in-playlist (playlist only)]",
  async execute(message, arguments) {
    if (!message.member.voice.channel) {
      return message.reply("you need to be in a voice channel to queue music!");
    }

    if (arguments[0].match(/^http.+playlist\?list=(.+)&?/)) return queuePlaylist(message, songUrl, arguments[1]);
    const songUrl = await getSongUrl(arguments);
    if (!songUrl) return message.reply("sorry I couldn't find this song 😬😬. Maybhaps give me the link?");

    const songInfo = await ytdl.getInfo(songUrl).catch((error) => {
      console.log(error);
      return message.reply("this link is invalid");
    });

    const trashMessage = checkTrash(songInfo.videoDetails.title.toLowerCase());
    if (trashMessage) return message.reply(trashMessage);

    addSong.exec(message, songInfo);
  }
};

async function getSongUrl(arguments) {
  if (arguments[0].match(/^http/)) return arguments[0];

  const result = await youtube.search.list({
    part: "snippet",
    q: arguments.join(" "),
    type: "video",
    maxResults: 1
  });

  if (result.data.items) {
    return `https://www.youtube.com/watch?v=${ result.data.items[0].id.videoId }`;
  }
}

function checkTrash(title) {
  const trash = trashes.some((trash) => {
    if (title.includes(trash)) return trash;
  });

  if (trash) {
    const refusal = [
      `no ${ trash } please!`,
      `I refuse to queue ${ trash }`,
      `nah bro, not ${ trash }`,
      `${ trash }... this ain't it chief`
    ];
    return refusal[Math.floor(Math.random() * refusal.length)]
  }
}

function queuePlaylist(message, url, number) {
  const id = url.match(/^http.+playlist\?list=(.+)&?/)[1];
  scrapePlaylist(id).then((response) => {
    const urls = response.playlist.map((video) => video.url);
    addPlaylist.exec(message, urls, number);
  });
}