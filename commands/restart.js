module.exports = {
  name: "restart",
  description: "Restart the bot",
  arguments: false,
  execute(message, arguments) {
    process.exit();
  }
};