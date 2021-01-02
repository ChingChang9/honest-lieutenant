const firebase = require("firebase");
const { firebaseConfig } = require("@/config.json");
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

module.exports = {
	database,
	async getQueue(guildId) {
		const queue = await database.ref(`${ guildId }/queue`).once("value");
		return Object.values(queue.val() || {});
	},
	async getItem(guildId, item) {
		const reference = await database.ref(`${ guildId }/settings/${ item }`).once("value");
		return reference.val();
	},
	async updateValue(path, value) {
		await database.ref(path).update(value);
	}
};