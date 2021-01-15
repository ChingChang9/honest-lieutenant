const { lmao, owo, no, vexeraPlay, talkingAbout, coffinDance, dadJoke } = require("require-all")(__dirname);

module.exports = {
	run(message) {
		const content = message.content.toLowerCase().split(/\s|\n/);

		lmao(message, content) ||
    owo(message, content) ||
    no(message, content) ||
    vexeraPlay(message, content) ||
    talkingAbout(message, content) ||
    coffinDance(message, content) ||
    dadJoke(message, content);
	}
};