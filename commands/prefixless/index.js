const { lmao, owo, no, vexeraPlay, talkingAbout, coffinDance, dadJoke } = require("require-all")(__dirname);

const functions = [lmao, owo, no, vexeraPlay, talkingAbout, coffinDance, dadJoke];

module.exports = {
	run(message) {
		const content = message.content.toLowerCase().split(/\s|\n/);
		const chance = Math.random();

		functions.some(prefixless => chance < message.guild.getSpamRate(prefixless.name) && prefixless.run(message, content));
	}
};