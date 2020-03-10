const fs = require("fs");
const Discord = require("discord.js");
const Canvas = require("canvas");

const folderSize = fs.readdirSync("./assets/keira").length;

module.exports = {
  name: "keira",
  description: "Sends a random picture of Keira Knightley",
  arguments: false,
  async execute(message, arguments) {const index = Math.floor(Math.random() * folderSize);
    message.channel.send({
      files: [`./assets/keira/${ index }.jpg`]
    });
  }
};