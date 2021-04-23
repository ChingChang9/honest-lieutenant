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
	async updateGuildValue(guildId, value) {
		await database.ref(`guilds/${ guildId }`).update(value);
	},
	async updateUserValue(userId, value) {
		await database.ref(`users/${ userId }`).update(value);
	}
};

process.once("SIGINT", () => {
	database.goOffline();
	process.exit();
});

process.once("message", message => {
	if (message === "shutdown") {
		database.goOffline();
		process.exit();
	}
});