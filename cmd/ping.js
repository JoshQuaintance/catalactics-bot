const Discord = require('discord.js');
const client = new Discord.Client();
const newMsg = require("../functions/newMsg.js");
const generateFields = require("../functions/generateEmbedFields");

module.exports = {
    prefix: "ping",
    additionalParam: null,
    desc: "Pings the Bot, and it will reply with a message containing the Ping of the bot.",
    command: async function ping(msg) {
        let pingMsg = await msg.channel.send(newMsg("#FFFFFF", "Ping", "Pinging!"));
        let field = generateFields(
            ["Fun fact", "The color of this embed will change depending on the ping time!!"]
            );

        let pingTime = Math.round(pingMsg.createdTimestamp - msg.createdTimestamp);
        let clr = pingTime < 100 ? "#21ed4a" : "#f02222";
        let newText = newMsg(clr, "Pinged!", `Ping: ${pingTime - 10}ms`, field);

        pingMsg.edit(newText);
    }
};