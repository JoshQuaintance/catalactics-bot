import { Message } from 'discord.js';
import { getSettings } from '../utils/get-settings';
import mongoose from 'mongoose';
// import { roleSchema } from '../index';
const URI = getSettings().MONGO_URI;

mongoose
	.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(err => (err ? console.log(err) : undefined));

//Functions
import desc from '../utils/role-utils/desc';
import roleCheck from '../utils/role-utils/roleCheck';

//! Make Give Function
import give from '../utils/role-utils/give';

import info from '../utils/role-utils/info';
import { CommandsType } from '../utils/cmd-def.int';
/**
 * Function for role editing and infos.
 * @param {Discord.Message} msg Message Object
 */
export const role: CommandsType = {
	prefix: 'role',
	additionalParam: '<Options> <...arguments>',
	args: [
		{
			options: 'desc `<role> <description>`'
		},
		{
			options: 'info `<role>`'
        },
        {
            options: 'give `<role> <user>`'
        }
    ],
    examples: [
        'desc @ServerOwner Owner of the server',
        'info @ServerOwner',
        'give @ServerOwner @Catalactics'
    ],
	desc: 'Advanced role command, additional arguments will change how it react.',

	command: (msg, {client, settings}) => {
		try {
			const msgArray = msg.content.split(' ');
			const funcPrefix = msgArray[1];
			const roleToFind = msgArray[2];

			if (funcPrefix == undefined) return msg.channel.send(`Please specify an argument.`);
			if (funcPrefix == 'info') return roleCheck(msg, roleToFind, info);
			if (funcPrefix == 'desc') return roleCheck(msg, roleToFind, desc);
            if (funcPrefix == 'give') return roleCheck(msg, roleToFind, give, client);
            else return msg.channel.send(`Please specify the right arguments. \nIf you need help, you can type \`${settings.PREFIX}help role\``)
		} catch (err) {
			console.error(err);
		}
	}
};

export default role;
