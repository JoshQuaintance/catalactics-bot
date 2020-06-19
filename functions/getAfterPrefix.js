const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix } = require("./config.json");

function getAfterPrefix(cmdPrefix, message) {
    message.split()
}

module.exports = getAfterPrefix;