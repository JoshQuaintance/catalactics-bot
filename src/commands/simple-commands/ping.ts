import { CommandsType } from '../../utils/interfaces';
import { MessageEmbed } from 'discord.js';

export const ping: CommandsType = {
	prefix: 'ping',
    desc: 'Pings the Bot, and it will reply with a message containing the Ping of the bot.',
    category: 'Utility',
	command: async msg => {
        try {
            let pingMsg = await msg.channel.send(new MessageEmbed()
                .setColor('#FFFFFF')
                .setTitle('Ping')
                .setDescription('Pinging!'));

            let pingTime = Math.round(pingMsg.createdTimestamp - msg.createdTimestamp);
            let clr = pingTime - 10 < 100 ? '#21ed4a' : '#f02222';
            let newText = new MessageEmbed()
            .setColor(clr)
            .setTitle('Pinged!')
            .setDescription(`Ping: ${pingTime - 10}ms`)
            .addField('Fun Fact', 'The color of this embed will change depending on the ping time!!');

            pingMsg.edit(newText);
        } catch (err) {
            console.error(err);
        }

	}
};

export default ping;
