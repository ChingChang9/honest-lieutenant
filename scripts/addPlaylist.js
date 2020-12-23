const ytdl = require("ytdl-core");
const addSong = require("@/scripts/addSong.js");
const firebase = require("@/scripts/firebase.js");

module.exports = {
  async exec(message, urls, number) {
    if (!urls) return message.reply("this list empty! YEET!");

    const ref = await firebase.database.ref(`${ message.guild.id }/queue`);

    if (!number && urls.length > 10) {
      message.channel.send("Queuing the first 10 by default...");
      number = 10;
    } else {
      number = parseInt(number) || urls.length;
    }
    const firstUrl = urls.shift();
    const songInfo = await ytdl.getInfo(firstUrl).catch((error) => console.log(error));
    await addSong.exec(message, songInfo);
    number -= 1;

    const songs = await addPlaylist(message, ref, urls, number);

    if (songs) {
      ref.update(songs);
      message.channel.send("Enqueued all of the above! 😁😁");
    }
  }
};

async function addPlaylist(message, ref, urls, number) {
  const queue = await ref.once("value");
  let enqueuedIndex = Object.keys(queue.val() || {}).length;
  let songs = {};

  for (const url of urls) {
    if (Object.keys(songs).length > number) return;

    const songInfo = await ytdl.getInfo(url).catch((error) => console.log(error));
    songs[ref.push().key] = {
      title: songInfo.videoDetails.title,
      videoUrl: songInfo.videoDetails.video_url,
      thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
      channel: songInfo.videoDetails.author.name,
      channelUrl: songInfo.videoDetails.author.channel_url,
      duration: songInfo.videoDetails.lengthSeconds,
      requester: message.member.displayName,
      requesterId: message.member.id
    };
    message.channel.send(`Ready to queue \`${ songInfo.videoDetails.title }\` at position \`${ ++enqueuedIndex }\``);
  }
  return songs;
}