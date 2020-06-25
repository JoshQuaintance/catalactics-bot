const Discord        = require('discord.js');
const client         = new Discord.Client();
const newMsg         = require("../functions/newMsg.js");
const generateFields = require("../functions/generateEmbedFields");
const role           = require("../data/role.json");

const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const mongoose = require("mongoose");
const URI = process.env.MONGO_URI;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

const main       = require("../index.js");
const roleSchema = main.roleSchema;
const memberHasPerm = require("../functions/memberHasPerm.js");    

/**
 * Function to get all the roles.
 * @param {Discord.Message} msg Message object
 */
async function roles(msg) {
    let msgText = await newMsg("#2a57eb", "Role List", `Hey there ${msg.author}, here's a list of the roles and what they do.`);

    let Role = mongoose.model("Role", roleSchema, msg.guild);
    await Role.find({}, (err, data) => {
        if(err) return console.log(err);
        
        data.forEach(role => {
            msgText.addField(role.roleName, `<@&${role.roleId}> - ${role.desc}`);
            
        })
        // console.log(msgText);
    });
    // console.log(msgText);
    msg.channel.send(msgText);
}

module.exports = {
    prefix         : "roles",
    additionalParam: null,
    desc           : "Gives a list of the roles and a little description of what they do",
    command        : roles
}