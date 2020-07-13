import { Message, Role } from 'discord.js';
import { memberHasPerm } from '../../../utils/memberHasPerm';
import { stripIndents } from 'common-tags';
/**
 * Function that gives a user a specific role
 * @param {Discord.Message} msg Message Object
 * @param {String} role Role string
 */
export default function give(msg: Message) {
    try {
        let check = memberHasPerm(msg, 'MANAGE_ROLES');
        if(check == false) return msg.channel.send(`I am sorry ${msg.author}, you do not have the permission to manage roles.`);

        let userMention = msg.mentions.members!.first();
        let roleMention = msg.mentions.roles!.first();
        if (userMention == undefined)
        return msg.channel.send(stripIndents`
        Please mention the user you want to give the role to :)
        You can do so using the '@' followed by the user's name
        `);


        if (roleMention == undefined) {
            let slicedStr = msg.content.split(' ').slice(2).join(' ');
            if (slicedStr == undefined) return msg.channel.send(`Please specify a role`);

            let role = msg.guild?.roles.cache.find(role => slicedStr.toLowerCase().includes(role.name.toLowerCase())) || undefined;
            if (role == undefined) return msg.channel.send('Cannot find the role specified, please specify an existing role!!');

            let userHaveRole = userMention.roles.cache.has(role.id);
            if (userHaveRole) return msg.channel.send(stripIndents`
            ${userMention} already have the role ${role}.
            Exiting without action...
            `);
            else {
                userMention!.roles.add(role!)
                .then(user => msg.channel.send(`${user} has been given the role ${role}`))
                .catch(err => {
                    return msg.channel.send(`I'm sorry ${msg.author}, you do not have the permission to give the role ${role}`)
                })
            }
        } else if(roleMention!.name == '@everyone') {
            return msg.channel.send(
                stripIndents`
            I'm sorry ${msg.author}, I cannot add the role @everyone to ${userMention}, because
            Everyone already have the role @everyone, duh...
            `)
        } else {
            let role = roleMention;
            let userHaveRole = userMention?.roles.cache.has(role.id);
            if(userHaveRole) {
                return msg.channel.send(`${userMention} already have the role ${role}. \nExiting without action...`);
            } else {
                userMention!.roles.add(role!)
                .then(user => msg.channel.send(`${user} has been given the role ${role}`))
                .catch(err => {
                    msg.channel.send(`Sry ${msg.author}, you don't have the permission to give the ${role} role`);
                });

            }
        }
    } catch (err) {
        console.error(err);
    }

}
