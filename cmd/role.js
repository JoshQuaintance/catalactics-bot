const Discord        = require("discord.js");
const client         = new Discord.Client();
const newMsg         = require("../functions/newMsg.js");
const generateFields = require("../functions/generateEmbedFields");

const settings = require("../functions/get-settings.js");
const URI      = settings.MONGO_URI;
const mongoose = require("mongoose");
const main     = require("../index.js");

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Schema for Roles and description.
const roleSchema = main.roleSchema;

//Functions
const funcs = require("../functions/roleFunctions");
const desc = (msg, role) => funcs.desc(msg, role);
const roleCheck = (msg, role, callback) => funcs.roleCheck(msg, role, callback);
const give = (msg, role) => funcs.give(msg, role);
const info = (msg, role) => funcs.info(msg, role);

module.exports = {
	prefix         : "role",
	additionalParam: "[Options] [Inputs]",
	args           : [
		{
			prefix: "desc",
			arguments: "desc [role] [description]",
			desc: "Adds a description to the specified role."
		},
		{
			prefix: "info",
			arguments: "info [role]",
			desc: "Shows a description of the specified role."
		}
	],
	desc           : "Advanced role command, additional arguments will change how it react.",
	command        : function(msg) {
		const msgArray   = msg.content.split(" ");
		const funcPrefix = msgArray[1];
		const roleToFind = msgArray[2];

		if (funcPrefix == "info") return roleCheck(msg, roleToFind, info);
		if (funcPrefix == "desc") return roleCheck(msg, roleToFind, desc);
		if (funcPrefix == "give") return roleCheck(msg, roleToFind, give);
		
	}
};
