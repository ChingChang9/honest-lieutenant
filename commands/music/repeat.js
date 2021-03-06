const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "repeat",
			group: "music",
			aliases: ["loop"],
			description: "Toggle repeat",
			format: "[one/queue/off]",
			examples: [
				{
					explanation: "Toggles between repeat one, queue, and off"
				},
				{
					input: "one",
					explanation: "Repeat one song"
				},
				{
					input: "queue",
					explanation: "Loop the entire playlist"
				},
				{
					input: "off",
					explanation: "Turn repeat off"
				}
			],
			guildOnly: true,
			arguments: [
				{
					key: "repeat",
					default: "toggle",
					validate: (_, message) => message.guild.voice?.dispatcher || "I'm not playing anything!"
				}
			]
		});
	}

	run(message, { repeat })  {
		repeat = simplifyRepeat(repeat, message.guild.voice.repeat);
		if (!repeat) return message.reply("Please enter one of `one`, `queue`, and `off`");

		message.guild.voice.repeat = repeat;

		switch (repeat) {
			case "one": message.react("🔂"); break;
			case "queue": message.react("🔁"); break;
			case "off": message.react("🇽");
		}
	}
};

function simplifyRepeat(repeat, lastRepeat) {
	if (repeat === "toggle") {
		switch (lastRepeat) {
			case "one": return "queue";
			case "queue": return "off";
			case "off": return "one";
		}
	} else if (["one", "on", "song", "track", "enable"].includes(repeat)) {
		return "one";
	} else if (["playlist", "all", "queue"].includes(repeat)) {
		return "queue";
	} else if (["disable", "off"].includes(repeat)) {
		return "off";
	}
}