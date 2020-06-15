const Discord = require("discord.js");
const client = new Discord.Client();

const create = require("./functions.js");
const newMsg = (clr, title, desc) => create.msg(clr, title, desc);


module.exports = {
    prefix: "uptime",
    desc: "Shows the uptime of the BOT since it's last activated.",
    command: function(msg) {
        
    }
}