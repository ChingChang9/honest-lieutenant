const firebase = require("@/scripts/firebase.js");
const play = require("@/scripts/play.js");

module.exports = {
  async exec(message, songInfo) {
    if (!message.member.voice.channel) {
      return message.reply("please only use this when you're in a voice channel");
    }

    const queue = await addSong(message, songInfo);

    const connection = await message.member.voice.channel.join();
    connection.voice.setSelfDeaf(true);

    if (!connection.player.dispatcher) {
      play.exec(message, connection, queue, queue.length - 1);
    }
  }
}

async function addSong(message, songInfo) {
  await firebase.database.ref(`${ message.guild.id }/queue`).push({
    title: songInfo.videoDetails.title,
    videoUrl: songInfo.videoDetails.video_url,
    thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
    channel: songInfo.videoDetails.ownerChannelName,
    channelUrl: `https://www.youtube.com/channel/${ songInfo.videoDetails.channelId }`,
    duration: songInfo.videoDetails.lengthSeconds,
    requester: message.member.displayName,
    requesterId: message.member.id
  });
  const queue = await firebase.getQueue(message.guild.id);

  message.channel.send(`Enqueued \`${ songInfo.videoDetails.title }\` at position \`${ queue.length }\``);

  return queue;
}