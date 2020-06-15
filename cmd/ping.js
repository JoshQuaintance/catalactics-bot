const Discord = require('discord.js');
const client = new Discord.Client();
const create = require('../functions.js');
const newMsg = (clr, title, desc) => create.msg(clr, title, desc);

module.exports = {
    prefix: "ping",
    desc: "Pings the Bot, and it will reply with a message containing the Ping of the bot.",
    command: async function ping(msg) {
      
        let pingMsg = await msg.channel.send(newMsg("#FFFFFF", "Ping", "Pinging!"));
        let field = create.fields([
            ["Fun fact", "The color of this embed will change depending on the ping time!!"],
        ]);

        let pingTime = Math.round(pingMsg.createdTimestamp - msg.createdTimestamp);
        let clr = pingTime < 90 ? "#21ed4a" : "#f02222";
        let newText = create.msg(clr, "Pinged!", `Ping: ${pingTime}ms`, field);

        pingMsg.edit(newText);
    }
};