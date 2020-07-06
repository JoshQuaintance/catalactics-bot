import { Message } from 'discord.js';
/**
 * Function that gives a user a specific role
 * @param {Discord.Message} msg Message Object
 * @param {String} role Role string
 */
export default function give(msg: Message, role: string) {
	let roleId = role.match(/\d/g)!.join('');
	let roleFound = msg.guild!.roles.cache.get(roleId!);
	let currentGuildIn = msg.guild;
}
