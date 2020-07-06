import { Message, MessageEmbed } from 'discord.js';
import mongoose from 'mongoose';
import { getSettings } from '../get-settings';
import { roleSchema } from '../../index';
import RoleType from '../db-defs/roleDB.int';
const URI = getSettings().MONGO_URI;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(err => (err ? console.log(err) : undefined));

/**
 * Function to give the specified role it's detail
 * @param {Discord.Message} msg Message object
 * @param {String} role Role String
 */
export default function info(msg: Message, role: string) {
	let roleId = role.match(/\d/g)!.join('');
	let roleFound = msg.guild!.roles.cache.get(<string>roleId);
	let currentGuildIn = msg.guild!.toString();
	let roleName = roleFound!.name;
	if (roleFound == null)
		return msg.channel.send(
			`I'm sorry ${msg.author}, you did not specify which role you want info on. If you want to get info on all the roles, you can use the \`!roles\` command.`
		);
	const Role = mongoose.model('Data', roleSchema, currentGuildIn);

	Role.findOne({ roleId: roleId }, (err: any, data: RoleType) => {
		if (err) throw err;
		if (data.desc !== 'No Description Added') {
            let embed = new MessageEmbed()
            .setColor('#f96e46')
            .setTitle('Role Info')
            .setDescription(`Here's the info about the role <@&${data.roleId}>`)
			.addField('Description', data.desc)
			.addField('Number of users with role', data.userNum);
			msg.channel.send(embed);
		}
		if (data.desc == 'No Description Added') {
			let embed = new MessageEmbed()
				.setColor('#f96e46')
				.setTitle('Role Info not Available')
				.setDescription(`I'm sorry ${msg.author}, the info on ${role} is not available. The owner of the server did not add any description about the role.`)

			msg.channel.send(embed);
		}
	});
}

