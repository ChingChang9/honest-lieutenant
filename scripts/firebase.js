const admin = require("firebase-admin");
const { firebaseServiceAccount } = require("@/config.json");

admin.initializeApp({
	credential: admin.credential.cert(firebaseServiceAccount),
	databaseURL: "https://honest-lieutenant.firebaseio.com"
});

const database = admin.database();

module.exports = {
	database,
	async updateValue(path, value) {
		await database.ref(path).update(value);
	}
};