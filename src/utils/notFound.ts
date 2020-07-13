import { getSettings } from './get-settings.js';
// import { CommandsType } from './cmd-def.int.js';
import { Message } from 'discord.js';
const PREFIX = getSettings().PREFIX;

/**
 * Function run if no command is found
 * @param {String[]} command
 * @param {String} msg
 *
 * @returns An array of all the prefixes that is close to the message
 */
export default function cmdNotFound(command: any[], msg: string) {

    const firstLetter = msg.toString().split(" ")[0][1];
    let regex = new RegExp(`^${firstLetter}`, "g");
    let close: string[] = [];
    let decided;
    command.forEach(cmd => {
        let prefix = cmd.prefix;
        if(regex.test(prefix) == true) {
            close.push(`${PREFIX}${prefix}`)
        }
    })

    decided = close.join(", ");

    return decided;
}

