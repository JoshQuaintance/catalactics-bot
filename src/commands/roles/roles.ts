import { getSettings } from '../../utils/get-settings';
import { roleSchema } from '../../index.js';
import { RolesDbInt, CommandsType } from '../../utils/interfaces';
import { MessageEmbed } from 'discord.js';
const mongoose = require('mongoose');
const URI = getSettings().MONGO_URI;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err: any) => console.error(err));

export const roles: CommandsType = {
	prefix: 'roles',
    desc: 'Gives a list of the roles and a little description of what they do',
    category: 'Information',
	command: async msg => {
		try {
			let msgText = new MessageEmbed()
				.setColor('#2a57eb')
				.setTitle('Role List')
				.setDescription(`Hey there ${msg.author}, here's a list of the roles and what they do.`);

			let Role = mongoose.model('Data', roleSchema, msg.guild);

			await Role.find({}, (err: any, data: RolesDbInt[]) => {
				if (err) return console.log(err);

				let sorted = data.sort((a, b) => b.rawPosition - a.rawPosition);

				sorted.forEach(role => {
					if (role.roleId == undefined) return;
					else msgText.addField(role.roleName, `<@&${role.roleId}> - ${role.desc}`);
				});
				// console.log(msgText);
			});
			// console.log(msgText);
			msg.channel.send(msgText);
		} catch (err) {
			console.error(err);
		}
	}
};

export default roles;
