let { readdirSync } = require("fs");
const folderSize = readdirSync("./assets/i-know-what-youre-talking-about").length;
readdirSync = null;
delete require.cache[require.resolve("fs")];

module.exports = (message, content) => {
	if (content.join(" ").match(/you know what i(.)?m talking about/)) {
		if (Math.random() < 0.5) {
			return message.say({
				files: [`./assets/i-know-what-youre-talking-about/${
					Math.floor(Math.random() * folderSize)
				}.jpg`]
			});
		}
		return message.say({
			files: ["./assets/i-really-dont.jpg"]
		});
	}
};