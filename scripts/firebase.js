const firebase = require("firebase");
const { firebaseConfig } = require("@/config.json");
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

module.exports = {
  database: database,
  async getQueue(guildId) {
    const queue = await database.ref(`${ guildId }/queue`).once("value");
    return Object.values(queue.val() || {});
  },
  async getPlayed(guildId) {
    const played = await database.ref(`${ guildId }/settings/played`).once("value");
    return played.val();
  },
  async updateValue(path, value) {
    await database.ref(path).update(value);
  },
  async getPrefix(guildId) {
    const prefix = await database.ref(`${ guildId }/settings/prefix`).once("value");
    return prefix.val();
  }
};