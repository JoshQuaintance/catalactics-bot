import { Message, Role } from 'discord.js';
import mongoose from 'mongoose';
import { getSettings } from '../../../utils/get-settings';
import { roleSchema } from '../../../index';
import { memberHasPerm } from '../../../utils/memberHasPerm';
import { RolesDbInt } from '../../../utils/interfaces';
import { stripIndents } from 'common-tags';
const URI = getSettings().MONGO_URI;

mongoose
	.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => (err ? console.log(err) : undefined));

interface modifyRoleArgs {
    guildName: string | undefined;
    msg: Message;
}

async function modifyRole(role: Role, { guildName, msg }: modifyRoleArgs) {
    let roleIndex = msg.content.indexOf(role.name.toLowerCase());
    let description = msg.content.slice(roleIndex + role.name.length + 1);

    if (description == "") return msg.channel.send('Specify a description for the role please!!');

    const Role = mongoose.model('Data', roleSchema, guildName);
    await Role.findOne({ roleId: role.id }, (err: any, data: RolesDbInt) => {
        if (err) throw new Error(err);
        if (data.desc == 'No Description Added') {
            data.desc = description;

            data.save((err: any) => {
                if (err) throw new Error(err);
            });

            msg.channel.send(`Description added to ${role.name} : \`${description}\``);
        } else {
            msg.reply(stripIndents`
            There is already a description for this role, do you want to override?
            Type \`Yes\` to confirm, type anything else to cancel.
            Will expire in 10 seconds...
            `
            );

            let filter = (m: Message) => m.author == msg.author;

            msg.channel.awaitMessages(filter, { max: 1, time: 10000 }).then(conf => {
                if (conf.first() == undefined)
                    return msg.channel.send('Command Expired, will not collect messages.');

                if (conf.first()!.content.toLowerCase() == 'yes') {
                    data.desc = description;

                    data.save((err: any) => {
                        if (err) throw new Error(err);
                    });

                    msg.channel.send(
                        `Description Overridden. The new description is saved : \`${description}\``
                    );
                } else {
                    msg.channel.send('Override cancelled.');
                }
            })


        }
    }).catch(err => console.error(err));

}

/**
 * Function to add description to each role.
 * @param {Discord.Message} msg Message Object
 * @param {string} role Role Called
 */
export default (msg: Message) => {
	try {
        // First of all checks the member if they have the perms.
        let check = memberHasPerm(msg, 'MANAGE_ROLES');
        if (!check) return msg.channel.send(`I'm sorry ${msg.author}, You do no have the permission to manage roles`);

        let guildName = msg.guild?.toString();
        let mention = msg.mentions.roles.first();

        if (mention == undefined ) {
            let typedRole = msg.content.split(' ').slice(2).join(' ');
            if (typedRole.length < 1) return msg.channel.send('Please specify a role!');
            let role = msg.guild?.roles.cache.find(role => typedRole.includes(role.name.toLowerCase()));

            if (role == undefined) return msg.channel.send(stripIndents`
            I'm sorry ${msg.author}, it seems like that role does not exist,
            Next time please use an existing role.
            Exiting without any action...
            `);

            return modifyRole(role, { guildName , msg })

        } else if (mention !== undefined) {
            let role = mention;

            return modifyRole(role, { guildName, msg });
        } else {
            return msg.channel.send(stripIndents`
            I'm sorry ${msg.author}, it seems like that role does not exist,
            Next time please use an existing role.
            Exiting without any action...
            `)
        }

	} catch (err) {
		console.error(err);
	}
};
