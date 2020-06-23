const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const mongoose = require("mongoose");
const URI = process.env.MONGO_URI;
const generateField = require("./generateEmbedFields.js");
const newMsg = require("./newMsg");

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Schema for Roles and description.
const main       = require("../index.js");
const roleSchema = main.roleSchema;
const memberHasPerm = require("./memberHasPerm.js");

module.exports = {
	/**
   * Function to check if the role exists.
   * @param {String} msg The message object
   * @param {String} role Role id called out
   * @param {String} callback Callback function name
   */
	roleCheck(msg, role, callback) {
		if (role == "@everyone") return;
		let roleId = role.match(/\d/g).join("");
		let roleFound = msg.guild.roles.cache.get(roleId);
		if (roleFound !== null) return callback(msg, role);
		else msg.channel.send("Role not Found");
	},

	/**
     * Function to add description to each role.
     * @param {String} msg 
     * @param {String} role 
     */
	desc(msg, role) {
		if(role == undefined) return msg.channel.send("Please specify a role!");
		let roleId = role.match(/\d/g).join("");
		let check  = memberHasPerm(msg, 'MANAGE_ROLES');
		if(!check) return msg.channel.send(`I'm sorry ${msg.author}, You do no have the permission to manage roles`)
		
		let roleFound = msg.guild.roles.cache.get(roleId);
		let currentGuildIn = msg.guild;

		let description = msg.content.split(" ").slice("3").join(" ");
		if (roleFound == null)
			return msg.channel.send(
				`I'm sorry ${msg.author}, it seems like that role does not exist, please use an existing role.`
			);
		let roleName = roleFound.name;
		// Checks if there is an additional argument at the end.

		if (description == null || description == "") {
			return msg.channel.send("I am sorry, you did not specify any description on the argument.");
		} else {
			let Role = mongoose.model("Role", roleSchema, currentGuildIn);
			Role.findOne({ roleId: roleId}, (err, data) => {
				if (data.desc == "No Description Added") {
					
					data.desc = description;
					data.save(err => {
						if(err) return console.log(err);
					})
					msg.channel.send(`Description added to ${roleName} : \`${description}\``);

				} else if(data.desc !== "No Description Added") {
					msg.reply(
						"There is already a description for this role, do you want to override? (Yes/No). Will expire in 10 seconds..."
					);

					let filter = m => m.author == msg.author;

					msg.channel.awaitMessages(filter, { max: 1, time: 10000 }).then(conf => {
						if (conf.first() == undefined)
							return msg.channel.send("Command Expired, will not collect messages.");
						if (conf.first().content.toLowerCase() == "yes") {
							data.desc = description;
							data.save(err => {
								if (err) console.log(err);
							});
							msg.channel.send(
								`Description Overridden. The new description is saved : \`${description}\``
							);
						} else {
							msg.channel.send("Override cancelled.");
						}
					});
				}

				if(err) console.log(err);
			});
		}
	},

	info(msg, role) {
		let roleId = role.match(/\d/g).join("");
		let roleFound = msg.guild.roles.cache.get(roleId);
		let currentGuildIn = msg.guild;
		let roleName = roleFound.name;
		if (roleFound == null) return msg.channel.send(`I'm sorry ${msg.author}, you did not specify which role you want info on. If you want to get info on all the roles, you can use the \`!roles\` command.`)
		const Role = mongoose.model("Role", roleSchema, currentGuildIn);
			
			Role.findOne({ roleId: roleId }, (err, data) => {
				if(err) return console.log(err);
				if(data.desc !== "No Description Added") {
					let embed = newMsg("#f96e46", "Role Info", 
					`Here's the info about the role <@&${data.roleId}> \n 👉  ${data.desc}`
					);
					msg.channel.send(embed);
				}
				if(data.desc == "No Description Added") {
					let embed = newMsg("#f96e46", "Role Info not Available", `I'm sorry ${msg.author}, the info on ${role} is not available. The owner of the server did not add any description about the role.`);
					msg.channel.send(embed);
				}


			});
		
		
	},

	give(msg, role) {
		let roleId = role.match(/\d/g).join("");
		let roleFound = msg.guild.roles.cache.get(roleId);
		let currentGuildIn = msg.guild;
	}
};
