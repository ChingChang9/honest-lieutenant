const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "bassboost",
			group: "filter",
			aliases: ["bass", "bb"],
			description: "Toggles or sets the amount of bass boost on a scale of 0 to 1 (inclusive)",
			guildOnly: true,
			format: "[on/off/number]",
			examples: [
				{
					explanation: "Toggles bassboost on and off"
				},
				{
					input: "on",
					explanation: "Boosts the bass"
				},
				{
					input: "0.3",
					explanation: "Sets bassboosted-ness to 0.3"
				}
			],
			arguments: [
				{
					key: "bassboost",
					default: "toggle"
				}
			]
		});
	}

	async run(message, { bassboost }) {
		if (!message.member.voice.channel) {
			return message.reply("please only use this when you're in a voice channel");
		}

		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		const voiceState = message.guild.voice;
		bassboost = calculateBassboost(voiceState, bassboost);

		if (isNaN(bassboost)) {
			return message.reply(`the input must be a number between 0 and 1 inclusive. Use \`${ message.guild.commandPrefix }help bassboost\` to see examples`);
		}

		if (voiceState.bass === bassboost) {
			return message.reply(`Bassboost is already set to ${ bassboost }`);
		}

		voiceState.filters.Bassboost = `bass=g=${ 20 * bassboost - 1 }`;
		voiceState.applyFilter(message, "Bassboost", {
			newBass: bassboost
		});
	}
};

function calculateBassboost(voiceState, bassboost) {
	const bassboostFloat = parseFloat(bassboost);

	if (bassboostFloat >= 0 && bassboostFloat <= 1) {
		return bassboostFloat;
	} else if (bassboost === "toggle") {
		return voiceState.appliedFilterNames.has("Bassboost") ? 0 : 0.5;
	} else if (bassboost === "off") {
		return 0;
	} else if (bassboost === "on") {
		return 0.5;
	}

	return NaN;
}