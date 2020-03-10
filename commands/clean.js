module.exports = {
  name: "clean",
  description: "Delete a number of the most recent messages",
  arguments: false,
  usage: "<#-of-messages>",
  default: "10",
  execute(message, arguments) {
    if (message.channel.type === "dm") {
      message.channel.send("I can't do that in DM");
    } else {
      let amount = 11;
      if (arguments.length) {
        amount = parseInt(arguments[0]) + 1;
        if (isNaN(amount)) {
          return message.channel.send("That doesn't seem to be a valid number.");
        } else if (amount < 2 || amount > 100) {
          return message.channel.send("You need to input a number between 1 and 99.");
        }
      }
      message.channel.bulkDelete(amount, true).catch((error) => {
        console.error(error);
        message.channel.send("There was an error trying to delete messages in this channel.");
      });
    }
  }
};