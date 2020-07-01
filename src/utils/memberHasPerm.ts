import { Message, PermissionString } from 'discord.js';

/**
 * Checks if the user have specific permission
 * @param {Message} msg The msg object
 * @param {PermissionString} perm Permission String.
 */
export function memberHasPerm(msg: Message, perm: PermissionString) {
	if (msg.author.bot) return;
    let member = msg.member;
    if (member == null) throw 'User Member Cannot Be Found';
	if (member.hasPermission(perm)) return true;
	else return false;
}

//This function may be useful later
/*function hasRoleOrNot(msg) {
    let user = msg.author;
    let Role = mongoose.model("Role", roleSchema, msg.guild);
    if(msg.author.bot) return;
    let member = msg.member.roles.cache;
    let x;
    Role.find((err, data) => {
        for(let role of data) {
            if(member.has(role.roleId)) {
                x = true;
                break;
            } else {
                x = false;
            }
        }
        data.forEach(role => {
            if(member.has(role.roleId)) return true;
            else return false;
        })
    } )
    return x;
}*/

