const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const mongoose = require("mongoose");
const URI = process.env.MONGO_URI;
const generateField = require("../generateEmbedFields.js");
const newMsg = require("../newMsg");

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Schema for Roles and description.
const main       = require("../../index.js");
const roleSchema = main.roleSchema;
const memberHasPerm = require("../memberHasPerm.js");

/**
 * Function to check if the role exists.
 * @param {String} msg The message object
 * @param {String} role Role id called out
 * @param {String} callback Callback function name
 */
function roleCheck(msg, role, callback) {
    if (role == "@everyone") return;
    let roleId = role.match(/\d/g).join("");
    let roleFound = msg.guild.roles.cache.get(roleId);
    if (roleFound !== null) return callback(msg, role);
    else msg.channel.send("Role not Found");
}

module.exports = roleCheck;