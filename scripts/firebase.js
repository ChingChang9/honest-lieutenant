const firebase = require("firebase");
const { firebaseConfig } = require("@/config.json");
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

module.exports = {
	database,
	async updateValue(path, value) {
		await database.ref(path).update(value);
	}
};