import { Message } from 'discord.js';
import mongoose from 'mongoose';
import { getSettings } from '../../utils/get-settings';
const URI = getSettings().MONGO_URI;

mongoose
	.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(err => (err ? console.log(err) : undefined));

/**
 * Function to check if the role exists.
 * @param {String} msg The message object
 * @param {String} role Role id called out
 * @param {String} callback Callback function name
 */
export default (msg: Message, role: string, callback: Function) => {
	if (role == '@everyone') return;
	if (role == undefined) return msg.channel.send('Please specify a role');
	let roleId = role.match(/\d/g)!.join('');
	let roleFound = msg.guild!.roles.cache.get(roleId!);
	if (roleFound !== null) return callback(msg, role);
	else msg.channel.send('Role not Found');
};
