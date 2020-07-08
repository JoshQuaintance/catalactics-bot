import { Message} from 'discord.js';
import { memberHasPerm } from '../../../utils/memberHasPerm';
/**
 * Function that gives a user a specific role
 * @param {Discord.Message} msg Message Object
 * @param {String} role Role string
 */
export default function give(msg: Message, role: string) {
    try {
        let check = memberHasPerm(msg, 'MANAGE_ROLES');
        if(check == false) return msg.channel.send(`I am sorry ${msg.author}, you do not have the permission to manage roles.`);
        let roleId = role.match(/\d/g)!.join('');
        let roleFound = msg.guild!.roles.cache.get(roleId!);
        let userFound = msg.mentions.members!.first();
        let userHaveRole = userFound?.roles.cache.has(roleId);
        if(userHaveRole) {
            return msg.channel.send(`${userFound} already have the role ${roleFound}. \nExiting without action...`);
        } else {
            userFound!.roles.add(roleFound!)
            .then(user => msg.channel.send(`${userFound} has been given the role ${roleFound}`))
            .catch(err => {
                msg.channel.send(`Sry ${msg.author}, you don't have the permission to give the ${roleFound} role`)
            });

        }
    } catch (err) {
        console.error(err);
    }

}
