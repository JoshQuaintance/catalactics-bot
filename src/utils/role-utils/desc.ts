import { Message } from 'discord.js';
import mongoose from 'mongoose';
import { getSettings } from '../get-settings';
import { roleSchema } from '../../index';
import { memberHasPerm } from '../memberHasPerm';
import RoleType from '../db-defs/roleDB.int';
const URI = getSettings().MONGO_URI;

mongoose
	.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(err => (err ? console.log(err) : undefined));

/**
 * Function to add description to each role.
 * @param {Discord.Message} msg Message Object
 * @param {string} role Role Called
 */
export default (msg: Message, role: string) => {
	try {
		if (role == undefined) return msg.channel.send('Please specify a role!');
		let roleId = role.match(/\d/g)!.join('');
		let check = memberHasPerm(msg, 'MANAGE_ROLES');
		if (!check) return msg.channel.send(`I'm sorry ${msg.author}, You do no have the permission to manage roles`);

		let roleFound = msg.guild!.roles.cache.get(roleId);
		const currentGuildIn: string | undefined = msg.guild!.toString();

		let description = msg.content.split(' ').slice(3).join(' ');
		if (roleFound == null)
			return msg.channel.send(
				`I'm sorry ${msg.author}, it seems like that role does not exist, please use an existing role.`
			);

		let roleName = roleFound.name;
		// Checks if there is an additional argument at the end.

		if (description == null || description == '') {
			return msg.channel.send('I am sorry, you did not specify any description for the role.');
		} else {
			const Role = mongoose.model('Data', roleSchema, currentGuildIn as string);
			Role.findOne({ roleId: roleId }, (err: any, data: RoleType) => {
				if (data.desc == 'No Description Added') {
					data.desc = description;

					data.save((err: any) => {
						if (err) throw err;
					});

					msg.channel.send(`Description added to ${roleName} : \`${description}\``);
				} else if (data.desc !== 'No Description Added') {
					msg.reply(
						'There is already a description for this role, do you want to override? (Yes/No). Will expire in 10 seconds...'
					);

					let filter = (m: Message) => m.author == msg.author;

					msg.channel.awaitMessages(filter, { max: 1, time: 10000 }).then(conf => {
						if (conf.first() == undefined)
							return msg.channel.send('Command Expired, will not collect messages.');

						if (conf.first()!.content.toLowerCase() == 'yes') {
							data.desc = description;

							data.save((err: any) => {
								if (err) throw err;
							});

							msg.channel.send(
								`Description Overridden. The new description is saved : \`${description}\``
							);
						} else {
							msg.channel.send('Override cancelled.');
						}
					});
				}

				if (err) throw err;
			});
		}
	} catch (err) {
		console.error(err);
	}
};
