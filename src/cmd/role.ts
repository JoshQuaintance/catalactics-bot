import { getSettings } from '../utils/get-settings';
import mongoose from 'mongoose';
// import { roleSchema } from '../index';
const URI = getSettings().MONGO_URI;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(err => (err ? console.log(err) : undefined));

//Functions
import desc from '../utils/role-utils/desc';
import roleCheck from '../utils/role-utils/roleCheck';

//! Make Give Function
import give from '../utils/role-utils/give';

const info = require('../utils/roles/info.js');
/**
 * Function for role editing and infos.
 * @param {Discord.Message} msg Message Object
 */
function role(msg) {
	const msgArray = msg.content.split(' ');
	const funcPrefix = msgArray[1];
	const roleToFind = msgArray[2];

	if (funcPrefix == 'info') return roleCheck(msg, roleToFind, info);
	if (funcPrefix == 'desc') return roleCheck(msg, roleToFind, desc);
	if (funcPrefix == 'give') return roleCheck(msg, roleToFind, give);
}

module.exports = {
	prefix: 'role',
	additionalParam: '[Options] [Inputs]',
	args: [
		{
			prefix: 'desc',
			arguments: 'desc [role] [description]',
			desc: 'Adds a description to the specified role.'
		},
		{
			prefix: 'info',
			arguments: 'info [role]',
			desc: 'Shows a description of the specified role.'
		}
	],
	desc: 'Advanced role command, additional arguments will change how it react.',
	command: role
};