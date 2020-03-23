const fs = require("fs");

module.exports = {
  name: "keira",
  description: "Send a random picture of Keira Knightley",
  arguments: false,
  execute(message, arguments) {
    const folderSize = fs.readdirSync("./assets/keira").length;
    const index = Math.floor(Math.random() * (folderSize));
    if (index === folderSize.length - 1) {
      message.channel.send("Ha! you thought!");
    }
    message.channel.send({
      files: [`./assets/keira/${ index }.jpg`]
    });
  }
};