module.exports = {
  name: "restart",
  description: "Restart the bot",
  aliases: ["reboot"],
  arguments: false,
  execute(message, arguments) {
    process.exit();
  }
};