module.exports = {
  name: "clean",
  description: "Delete a number of the most recent messages",
  arguments: false,
  usage: "<#-of-messages>",
  default: "10",
  execute(message, arguments) {
    if (message.channel.type === "dm") {
      return message.channel.send("I can't do that in DM");
    }
    let amount = 11;
    if (arguments.length) {
      amount = parseInt(arguments[0]) + 1;
      if (isNaN(amount)) {
        return message.reply("that doesn't seem to be a valid number");
      } else if (amount < 2 || amount > 100) {
        return message.reply("you need to input a number between 1 and 99");
      }
    }
    message.channel.bulkDelete(amount, true).catch((error) => {
      message.reply("there was an error trying to delete messages in this channel");
    });
  }
};