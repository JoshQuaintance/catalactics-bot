//Functions
import desc from './role-utils/desc';
import roleCheck from './role-utils/roleCheck';
import give from './role-utils/give';
// import info from './role-utils/info.txt';
import { CommandsType } from '../../utils/interfaces';
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
            options: 'give `<role> <user>`'
        }
    ],
    examples: [
        'desc @ServerOwner Owner of the server',
        'give @ServerOwner @Catalactics'
    ],
	desc: 'Advanced role command, additional arguments will change how it react.',
    category: 'Information',
	command: (msg, {client, settings}) => {
		try {
			const msgArray = msg.content.split(' ');
			const funcPrefix = msgArray[1];
			const roleToFind = msgArray[2];

			if (funcPrefix == undefined) return msg.channel.send(`Please specify an argument.`);
			// if (funcPrefix == 'info') return roleCheck(msg, roleToFind, info);
			if (funcPrefix == 'desc') return roleCheck(msg, roleToFind, desc);
            if (funcPrefix == 'give') return roleCheck(msg, roleToFind, give, client);
            else return msg.channel.send(`Please specify the right arguments. \nIf you need help, you can type \`${settings.PREFIX}help role\``)
		} catch (err) {
			console.error(err);
		}
	}
};

export default role;
