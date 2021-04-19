module.exports = {
	name: "no",
	run(message, content) {
		if (content[0].match(/^no+$/) && content.length === 1 && message.author.id === "195217084974759936") {
			return message.say("https://media.discordapp.net/attachments/458510721664417853/723527184635002890/unknown.png");
		}
	}
};