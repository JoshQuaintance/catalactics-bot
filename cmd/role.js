const Discord = require('discord.js');
const client = new Discord.Client();
const newMsg = require("../functions/newMsg.js");
const generateFields = require("../functions/generateEmbedFields");
const role = require("../data/role.json")
const { prefix } = require("../config.json");

function desc(msg, role) {
    let x = msg.guild.roles.cache.find(roles => roles.name === role);
    console.log(x);
    msg.channel.send(x);
}

module.exports = {
    prefix: "role",
    additionalParam: "[Options] [Inputs]",
    desc: "Advanced role command, additional arguments will change how it react.",
    command: function(msg) {
        const msgArray = msg.split(" ");
        const funcPrefix = msgArray[1];

        if(funcPrefix == "desc") {
            let roleToFind = msgArray[2];
            desc(msg, roleToFind);
        }
    }
}