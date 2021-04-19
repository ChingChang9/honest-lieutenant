const coffinTriggerWords = ["die", "dies", "dying"];

module.exports = {
	name: "coffinDance",
	run(message, content) {
		if (coffinTriggerWords.some(word => content.includes(word))) {
			return message.say("https://tenor.com/view/dancing-coffin-coffin-dance-funeral-funny-farewell-gif-16737844");
		}
	}
};