
/**
 * Function that gives a user a specific role
 * @param {Discord.Message} msg Message Object
 * @param {String} role Role string
 */
function give(msg, role) {
    let roleId = role.match(/\d/g).join("");
    let roleFound = msg.guild.roles.cache.get(roleId);
    let currentGuildIn = msg.guild;
}