const { prefix } = require("discord.js");

/**
 * Function run if no command is found
 * @param {String[]} command 
 * @param {String} msg 
 */
function cmdNotFound(command, msg) {
    // gg = first letter of the command argument
    let gg    = msg.split(" ")[0][1];
    let ch1   = new RegExp(`^${gg}`, "g");
    let close = [];
    let decided;
    command.forEach(cmd => {
        let prefix = cmd.prefix; 
        if(ch1.test(prefix) == true) {
            close.push(`!${prefix}`)
        }
    })
    
    decided = close.join(", ");

    return decided;
}

module.exports = cmdNotFound;