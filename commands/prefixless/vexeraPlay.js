module.exports = (message, content) => {
	if (content[0] === "+play") {
		return message.say("heyy im online too and im better than <@228537642583588864> 😉");
	}
};