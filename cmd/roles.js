const Discord = require('discord.js');
const client = new Discord.Client();
const newMsg = require('../functions/newMsg.js');
const generateFields = require('../functions/generateEmbedFields');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');
const URI = process.env.MONGO_URI;
mongoose
	.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(err => (err ? console.log(err) : undefined));

const main = require('../index.js');
const roleSchema = main.roleSchema;
const memberHasPerm = require('../functions/memberHasPerm.js');


/**
 * Function to get all the roles.
 * @param {Discord.Message} msg Message object
 */
async function roles(msg) {
	let msgText = newMsg(
		'#2a57eb',
		'Role List',
		`Hey there ${msg.author}, here's a list of the roles and what they do.`
	);

	let Role = mongoose.model('Data', roleSchema, msg.guild);

	await Role.find({}, (err, data) => {
        if (err) return console.log(err);


		let sorted = data.sort((a, b) => b.rawPosition - a.rawPosition);

		sorted.forEach(role => {
            if(role.roleId == undefined) return;
			else msgText.addField(role.roleName, `<@&${role.roleId}> - ${role.desc}`);
		});
		// console.log(msgText);
	});
	// console.log(msgText);
	msg.channel.send(msgText);
}

module.exports = {
	prefix          : 'roles',
	additionalParam : null,
	desc            : 'Gives a list of the roles and a little description of what they do',
	command         : roles
};
