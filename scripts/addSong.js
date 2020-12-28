const firebase = require("@/scripts/firebase.js");
const play = require("@/scripts/play.js");

module.exports = {
  exec(message, songInfo) {
    if (!message.member.voice.channel) {
      return message.reply("please only use this when you're in a voice channel");
    }

    Promise.all([
      addSong(message, songInfo),
      message.member.voice.channel.join().then((connection) => {
        connection.voice.setSelfDeaf(true);
        return connection;
      })
    ]).then((result) => {
      const [queue, connection] = result;

      if (!connection.player.dispatcher) {
        play.exec(message, connection, queue, queue.length - 1);
      }
    });
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

  message.say(`Enqueued \`${ songInfo.videoDetails.title }\` at index \`${ queue.length }\``);

  return queue;
}