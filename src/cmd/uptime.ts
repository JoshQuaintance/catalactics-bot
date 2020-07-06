import { MessageEmbed } from 'discord.js';
import { CommandsType } from '../utils/cmd-def.int';

export function getUptime(time: number): string[] {
	let totalSeconds = time;
	let days =
		Math.floor(totalSeconds / 86400) <= 0
			? ''
			: Math.floor(totalSeconds / 86400) < 10
				? `0${Math.floor(totalSeconds / 86400)} days`
				: `${Math.floor(totalSeconds / 86400)} days`;

	let hours =
		Math.floor(totalSeconds / 3600) <= 0
			? ''
			: Math.floor(totalSeconds / 3600) < 10
				? `0${Math.floor(totalSeconds / 3600)} hours`
				: `${Math.floor(totalSeconds / 3600)} hours`;

	totalSeconds %= 3600;
	let minutes =
		Math.floor(totalSeconds / 60) <= 0
			? ''
			: Math.floor(totalSeconds / 60) < 10
				? `0${Math.floor(totalSeconds / 60)}  minutes`
				: `${Math.floor(totalSeconds / 60)} minutes`;

	let seconds =
		Math.floor(totalSeconds % 60) < 10
			? `0${Math.floor(totalSeconds % 60)} seconds`
			: `${Math.floor(totalSeconds % 60)} seconds`;

	return [ days, hours, minutes, seconds ];
}

export const uptime: CommandsType = {

	prefix          : 'uptime',
	desc            : 'Shows the uptime of the bot',
	command         : (msg, { client }): void => {
        try {
            let totalSeconds = client!.uptime! / 1000;
            let up = getUptime(totalSeconds);
            let days = up[0],
                hours = up[1],
                minutes = up[2],
                seconds = up[3];

            let embed = new MessageEmbed()
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
