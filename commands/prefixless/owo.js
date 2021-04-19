module.exports = {
	name: "owo",
	run(message, content) {
		if (content[0] === "owo" && content.length === 1) {
			return message.say("What's this?");
		}
	}
};