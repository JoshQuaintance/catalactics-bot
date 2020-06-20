const Discord = require('discord.js');
const client = new Discord.Client();
const newMsg = require("../functions/newMsg.js");
const generateFields = require("../functions/generateEmbedFields");
const role = require("../data/role.json")
const { prefix } = require("../config.json");


module.exports = {
    prefix: "roles",
    additionalParam: null,
    desc: "Gives a list of the roles and what they do.",
    command(msg) {
        let roleList = generateFields(
            ["Server Owner", `<@&${role.owner}> - has the full access of the server.`],
            ["Admin", `<@&${role.admin}> - has almost full access to the server. They have access to private channels. They have access to admin bot commands. They are able to assign roles, kick, ban, change user's nicknames, change server channels and delete messages.`],
            ["Leaders", `<@&${role.leader}> - has most access to the server. They have access to admin bot commands. They are able to kick, ban, change user's nicknames, change server channels, and delete messages.`],
            ["Moderator", `<@&${role.moderator}> - have full access to the member list. They have access to admin bot commands. They can kick, ban, change a user's nickname, and delete messages. They are the ones that will help the leaders to enforce the rules.`]

        )


        let msgText = newMsg("#2a57eb", "Role List", `Hey there ${msg.author}, here's a list of the roles and what they do.`, roleList);

        msg.channel.send(msgText);
        msg.channel.send("can you edit these")
    }
}