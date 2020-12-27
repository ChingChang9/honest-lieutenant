const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const servers = require("@/scripts/servers.js");

module.exports = class RepeatCommand extends Command {
  constructor(client) {
    super(client, {
			name: "repeat",
			group: "music",
			memberName: "repeat",
			aliases: ["loop"],
			description: "Toggles repeat",
      format: "[one/queue/off]",
      examples: [
        "` (Toggles between repeat one, queue, and off)",
        " one` (Repeats one song)",
        " queue` (Loops the entire playlist)",
        " off` (Turns repeat off)"
      ],
      guildOnly: true,
      args: [
        {
          key: "repeat",
					prompt: "Repeat on or off?",
					type: "string",
          default: "toggle"
        }
      ]
		});
  }

  async run(message, { repeat })  {
    if (!servers.getDispatcher(message.guild.id)) {
      return message.reply("I'm not playing anything!");
    }

    repeat = await simplifyRepeat(message.guild.id, repeat);
    if (!repeat) return message.reply("please enter one of `one`, `queue`, or `off`");

    firebase.updateValue(`${ message.guild.id }/settings`, {
      repeat
    });

    switch (repeat) {
      case "one": message.react("🔂"); break;
      case "queue": message.react("🔁"); break;
      case "off": message.react("🇽");
    }
  }
};

async function simplifyRepeat(guildId, repeat) {
  if (repeat === "toggle") {
    const lastRepeat = await firebase.getItem(guildId, "repeat");

    switch (lastRepeat) {
      case "one": return "queue";
      case "queue": return "off";
      case "off": return "one";
    }
  } else if (["one", "song", "track", "enable"].includes(repeat)) {
    return "one";
  } else if (["playlist", "all", "queue"].includes(repeat)) {
    return "queue";
  } else if (["disable", "off"].includes(repeat)) {
    return "off";
  }
}