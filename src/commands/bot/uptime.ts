import { MessageEmbed } from 'discord.js';
import { CommandsType } from '../../utils/interfaces';

export function getUptime(time: number): string[] {
  let totalSeconds = time;
  const days =
    Math.floor(totalSeconds / 86400) <= 0
      ? ''
      : Math.floor(totalSeconds / 86400) < 10
        ? `0${Math.floor(totalSeconds / 86400)} days`
        : `${Math.floor(totalSeconds / 86400)} days`;

  const hours =
    Math.floor(totalSeconds / 3600) <= 0
      ? ''
      : Math.floor(totalSeconds / 3600) < 10
        ? `0${Math.floor(totalSeconds / 3600)} hours`
        : `${Math.floor(totalSeconds / 3600)} hours`;

  totalSeconds %= 3600;
  const minutes =
    Math.floor(totalSeconds / 60) <= 0
      ? ''
      : Math.floor(totalSeconds / 60) < 10
        ? `0${Math.floor(totalSeconds / 60)}  minutes`
        : `${Math.floor(totalSeconds / 60)} minutes`;

  const seconds =
    Math.floor(totalSeconds % 60) < 10
      ? `0${Math.floor(totalSeconds % 60)} seconds`
      : `${Math.floor(totalSeconds % 60)} seconds`;

  return [ days, hours, minutes, seconds ];
}

export const uptime: CommandsType = {
  prefix: 'uptime',
  desc: 'Shows the uptime of the bot',
  category: 'Information',
  command: (msg, { client }): void => {
    try {
      const totalSeconds = (client.uptime as number) / 1000;
      const up = getUptime(totalSeconds);
      const days = up[0],
        hours = up[1],
        minutes = up[2],
        seconds = up[3];

      const embed = new MessageEmbed()
        .setColor('#cf43e8')
        .setTitle('Uptime')
        .setDescription(' ')
        .addField('Bot Uptime', `${days} ${hours} ${minutes} ${seconds}`);

      msg.channel.send(embed);
    } catch (err) {
      console.error(err);
    }
  }
};

export default uptime;
