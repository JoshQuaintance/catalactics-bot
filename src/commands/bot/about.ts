import { MessageEmbed } from 'discord.js';
import { CommandsType } from '../../utils/interfaces';

export const about: CommandsType = {
  prefix: 'about',
  desc: 'Give the BOT a little description of itself. They deserve some too.',
  category: 'Information',
  command: (msg, { settings }) => {
    try {
      const aboutMsg = new MessageEmbed()
        .setColor('#4364e8')
        .setTitle('Let Me Introduce Myself')
        .setDescription('Hello there My name is Catalactics Bot.')
        .addFields(
          {
            name: 'Who made me',
            value: 'I was made by someone named Catalactics'
          },
          {
            name: 'Fact about me',
            value: 'Fun facts! I was made using Discord.js'
          },
          {
            name: 'What can I do',
            value: `I can do a number of things, you can get my attention using the \`${settings.PREFIX}\` prefix. To find more about my commands, you can use the \`${settings.PREFIX}help\` command.`
          },
          {
            name: 'My Source Code',
            value: '[catalactics-bot](https://github.com/JoshuaPelealu/catalactics-bot)'
          }
        )
        .setFooter('That\'s All, thank you for your attention!');

      msg.channel.send(aboutMsg);
    } catch (err) {
      console.error(err);
    }
  }
};

export default about;
