const { Command } = require("discord.js-commando");
const ytdl = require("ytdl-core");
const { google } = require("googleapis");
const { scrapePlaylist } = require("youtube-playlist-scraper");
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

module.exports = class PlayCommand extends Command {
  constructor(client) {
		super(client, {
			name: "play",
			group: "music",
			memberName: "play",
			aliases: ["add", "p", "a"],
			description: "Queue music in the voice channel",
      format: "<name/link/playlist> [#-in-playlist (playlist only)]",
			examples: [
        "let it go",
        "https://www.youtube.com/watch?v=3zbGMcsCtjg",
        "https://www.youtube.com/playlist?list=PLMaCx7c9SM1H6rUN5SFuRX2HaGmg5d7Nd",
        "https://www.youtube.com/playlist?list=PLMaCx7c9SM1H6rUN5SFuRX2HaGmg5d7Nd 4"
      ],
      guildOnly: true,
			args: [
				{
					key: "song",
					prompt: "What do you want to play?",
					type: "string"
				}
			]
		});
	}

  async run(message, { song }) {
    if (!message.member.voice.channel) {
      return message.reply("please only use this when you're in a voice channel");
    }

    const songUrl = await getSongUrl(song);
    if (!songUrl) return message.reply("sorry I couldn't find this song 😬😬. Maybhaps give me the link?");
    if (song.match(/^http.+playlist\?list=(.+)&?/)) return queuePlaylist(message, songUrl, song.split(" ")[1]);

    const songInfo = await ytdl.getInfo(songUrl).catch((error) => {
      console.log(error);
      return message.reply("this link is invalid");
    });

    const trashMessage = checkTrash(songInfo.videoDetails.title.toLowerCase());
    if (trashMessage) return message.reply(trashMessage);

    addSong.exec(message, songInfo);
  }
};

async function getSongUrl(song) {
  if (song.match(/^http/)) return song;

  const result = await youtube.search.list({
    part: "snippet",
    q: song,
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