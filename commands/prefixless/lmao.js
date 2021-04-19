module.exports = {
	name: "lmao",
	run(message, content) {
		if (content[0].match(/^ay+$/) && content.length === 1) {
			return message.say("lmao");
		}
	}
};