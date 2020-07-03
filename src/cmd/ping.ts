import { CommandsType } from '../utils/cmd-def.int';
import newMsg from '../utils/newMsg';
import generateFields from'../utils/generateEmbedFields';

export const ping: CommandsType = {
	prefix: 'ping',
	desc: 'Pings the Bot, and it will reply with a message containing the Ping of the bot.',
	command: async msg => {
        try {
            let pingMsg = await msg.channel.send(newMsg('#FFFFFF', 'Ping', 'Pinging!'));
            let field = generateFields([ 'Fun fact', 'The color of this embed will change depending on the ping time!!' ]);

            let pingTime = Math.round(pingMsg.createdTimestamp - msg.createdTimestamp);
            let clr = pingTime - 10 < 100 ? '#21ed4a' : '#f02222';
            let newText = newMsg(clr, 'Pinged!', `Ping: ${pingTime - 10}ms`, field);

            pingMsg.edit(newText);
        } catch (err) {
            console.error(err);
        }

	}
};
