//Functions
import desc from './role-utils/desc';
import give from './role-utils/give';
import info from './role-utils/info';
import { CommandsType } from '../../utils/interfaces';
import { stripIndents } from 'common-tags';
/**
 * Function for role editing and infos.
 * @param {Discord.Message} msg Message Object
 */
export const role: CommandsType = {
  prefix: 'role',
  additionalParam: '<Options> <...arguments>',
  args:
    [
      'desc `<role> <description>`',
      'give `<role> <user>`',
      'info `<role>`'
    ],
  examples:
    [
      'desc @ServerOwner Owner of the server',
      'give @ServerOwner @Catalactics'
    ],
  desc: 'Advanced role command, additional arguments will change how it react.',
  category: 'Information',
  command: (msg, {settings}) => {
    try {
      const msgArray = msg.content.split(' ');
      const funcPrefix = msgArray[1];

      switch (funcPrefix) {
      case undefined:
        msg.channel.send('Please specify an argument.');
        break;
      case 'desc':
        desc(msg);
        break;
      case 'give':
        give(msg);
        break;
      case 'info':
        info(msg);
        break;
      default:
        msg.channel.send(stripIndents`
          Please specify the right arguments.
          If you need help, you can type \`${settings.PREFIX}help role\`
        `);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export default role;
