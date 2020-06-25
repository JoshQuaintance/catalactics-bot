const mongoose = require("mongoose");
const settings = require("../../functions/get-settings.js");
const URI = settings.MONGO_URI;
const generateField = require("../generateEmbedFields.js");
const newMsg = require("../newMsg");

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => err ? console.log(err) : undefined);
// Schema for Roles and description.
const main       = require("../../index.js");
const roleSchema = main.roleSchema;
const memberHasPerm = require("../memberHasPerm.js");

/**
 * Function to give the specified role it's detail
 * @param {Discord.Message} msg Message object
 * @param {String} role Role String
 */
function info(msg, role) {
    let roleId = role.match(/\d/g).join("");
    let roleFound = msg.guild.roles.cache.get(roleId);
    let currentGuildIn = msg.guild;
    let roleName = roleFound.name;
    if (roleFound == null) return msg.channel.send(`I'm sorry ${msg.author}, you did not specify which role you want info on. If you want to get info on all the roles, you can use the \`!roles\` command.`)
    const Role = mongoose.model("Role", roleSchema, currentGuildIn);

        Role.findOne({ roleId: roleId }, (err, data) => {
            if(err) return console.log(err);
            if(data.desc !== "No Description Added") {
                let embed = newMsg("#f96e46", "Role Info", `Here's the info about the role <@&${data.roleId}>`)
                .addField("Description", data.desc)
                .addField("Number of users with role", data.userNum);
                msg.channel.send(embed);
            }
            if(data.desc == "No Description Added") {
                let embed = newMsg("#f96e46", "Role Info not Available", `I'm sorry ${msg.author}, the info on ${role} is not available. The owner of the server did not add any description about the role.`);
                msg.channel.send(embed);
            }


        });


}

module.exports = info;
