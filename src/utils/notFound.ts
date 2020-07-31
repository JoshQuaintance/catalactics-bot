import { getSettings } from './get-settings';
import { CommandsType } from './interfaces';
const PREFIX = getSettings().PREFIX;

/**
 * Function run if no command is found
 * @param {String[]} command
 * @param {String} msg
 *
 * @returns An array of all the prefixes that is close to the message
 */
export default function cmdNotFound(command: CommandsType[], msg: string): string {
  // Get first letter of the command string
  const firstLetter = msg.toString().split(' ')[0][1];

  // Filter the command list for commands that has prefix
  // that starts with the firstLetter
  const closeTo = command.filter(cmd => cmd.prefix.startsWith(firstLetter));

  // Map the main PREFIX with the command's prefix and join them using commas
  // and return;
  return closeTo.map(cmd => PREFIX + cmd.prefix).join(', ');
}

