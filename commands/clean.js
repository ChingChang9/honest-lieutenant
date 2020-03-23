module.exports = {
  name: "clean",
  description: "Delete a number of the most recent messages",
  aliases: ["sweep"],
  arguments: false,
  usage: "<#-of-messages>",
  default: "10",
  execute(message, arguments) {
    if (message.channel.type === "dm") {
      return message.channel.send("I can't do that in DM");
    }
    let amount = parseInt(arguments[0]) + 1 || 11;
    if (isNaN(amount)) {
      return message.reply("that doesn't seem to be a valid number");
    }
    if (amount < 2 || amount > 100) {
      return message.reply("you need to input a number between 1 and 99");
    }
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.reply("you don't have the permission to use this command");
    }
    message.channel.bulkDelete(amount, true).catch((error) => {
      message.reply("there was an error trying to delete messages in this channel");
    });
  }
};