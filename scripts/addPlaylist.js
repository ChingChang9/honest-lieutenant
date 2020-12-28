const ytdl = require("ytdl-core");
const firebase = require("@/scripts/firebase.js");
const play = require("@/scripts/play.js");

module.exports = {
  async exec(message, urls, number) {
    if (!message.member.voice.channel) {
      return message.reply("please only use this when you're in a voice channel");
    }

    if (!urls) return message.reply("this list empty! YEET!");

    if (!number && urls.length > 10) {
      message.say("Queuing the first 10 by default...");
      number = 10;
    } else {
      number = parseInt(number) || urls.length;
    }
    const queueRef = await firebase.database.ref(`${ message.guild.id }/queue`);

    Promise.all([
      addPlaylist(message, queueRef, urls, number - 1),
      message.member.voice.channel.join().then((connection) => {
        connection.voice.setSelfDeaf(true);
        return connection;
      })
    ]).then(async (result) => {
      const [songs, connection] = result;
      queueRef.update(songs);
      const songLength = Object.keys(songs).length;
      message.say(`Enqueued ${ songLength } songs`);

      if (!connection.player.dispatcher) {
        const queue = await queueRef.once("value");
        const queueList = Object.values(queue.val());
        play.exec(message, connection, queueList, queueList.length - songLength);
      }
    });
  }
};

async function addPlaylist(message, queueRef, urls, number) {
  const queue = await queueRef.once("value");
  let enqueuedIndex = Object.keys(queue.val() || {}).length;
  let songs = {};
  let promises = [];

  for (const url of urls) {
    if (Object.keys(songs).length > number) return;

    promises.push(new Promise((resolve, reject) => {
      ytdl.getInfo(url).then((songInfo) => resolve(songInfo)).catch((error) => console.log(error));
    }));
  }

  return Promise.all(promises).then(async (songInfos) => {
    await songInfos.forEach((songInfo) => {
      songs[queueRef.push().key] = {
        title: songInfo.videoDetails.title,
        videoUrl: songInfo.videoDetails.video_url,
        thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
        channel: songInfo.videoDetails.author.name,
        channelUrl: songInfo.videoDetails.author.channel_url,
        duration: songInfo.videoDetails.lengthSeconds,
        requester: message.member.displayName,
        requesterId: message.member.id
      };
    });

    return songs;
  });
}