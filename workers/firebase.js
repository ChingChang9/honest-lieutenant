let admin = require("firebase-admin");
let { firebaseServiceAccount } = require("@/config.json");

admin.initializeApp({
	credential: admin.credential.cert(firebaseServiceAccount),
	databaseURL: "https://honest-lieutenant.firebaseio.com"
});
firebaseServiceAccount = null;

const database = admin.database();
admin = null;
delete require.cache[require.resolve("firebase-admin")];

module.exports = {
	database,
	async updateValue(path, value) {
		await database.ref(path).update(value);
	}
};