module.exports = {
  name: "say",
  description: "Say something in Treaty of Versailles Discussion",
  arguments: true,
  usage: "<thing-to-say>",
  execute(message, arguments) {
    if (message.author.id === "371129637725798400") return message.guild.channels.cache.get("593316077069402113").send(arguments.join(" "));
    return message.reply("you don't have the permission to use this command");
  }
};