const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "filters",
			group: "filter",
			aliases: ["filter", "f"],
			description: "Display the applied filters",
			format: "[clear]",
			examples: [
				{
					explanation: "Displays the applied filters"
				},
				{
					input: "clear",
					explanation: "Clears all filters"
				},
				{
					input: "reset",
					explanation: "Clears all filters"
				}
			],
			guildOnly: true,
			arguments: [
				{
					key: "input",
					default: ""
				}
			]
		});
	}

	run(message, { input }) {
		if (input === "clear" || input === "reset") {
			return message.guild.voice?.clearAllFilters(message) || message.react("👍🏽");
		}

		if (!message.guild.voice) return message.embed("No Filters Applied");

		message.guild.voice.displayFilters(message);
	}
};