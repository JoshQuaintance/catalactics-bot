import { Message, MessageEmbed } from 'discord.js';
import mongoose from 'mongoose';
import { commandUsageSchema } from '../index';
import { CommandDbType } from '../utils/db-defs/commandDB.int';
import { CommandsType } from '../utils/cmd-def.int';
import { config } from 'dotenv/types';


export const help: CommandsType = {
	prefix: 'help',
	additionalParam: '[Command]',
	desc:
		"Displays all of the commands available. If a command is specified, it will display the description of the command. That's this command",
	/**
     * Get all the commands and display it.
     * @param {Discord.Message} msg Message Object
     */
	command: async function getAllCommands(msg, { settings, CMD }) {
		try {
            // Connect to the database using the URI from the variable file.
            mongoose.connect(settings.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
                .catch(err => {throw err});
			const Data = mongoose.model('Commands', commandUsageSchema, msg.guild!.toString());

			// Gets the argument
			let splitMsg = msg.content.split(' ')[1];

			// Finds the command using the prefix and return the object.
			const commandFound = CMD.find((command: any) => command.prefix == splitMsg);

			// If there is no argument, it's going to send the full list
			if (splitMsg == undefined || commandFound == undefined) {
				let embedMsg = new MessageEmbed()
					.setColor('#23f0c7')
					.setTitle('List of Commands')
					.setDescription(
						`Hey there ${msg.author}, Here's a full list of all the commands. \n For more information about each commands, type \`${settings.PREFIX}help <command>\``
					);

                await Data.find({}, (err: any, data: CommandsType[]) => {
                    if(err) throw err;

                    let x: any[] = []
                    data.forEach(cmd => {
                        if(!cmd.prefix) return;
                        x.push(`\`${cmd.prefix}\``)
                    })
                    let xx = x.join(' ');

                    embedMsg.addField(`All Commands`, xx)
                });

				msg.channel.send(embedMsg);
			} else {
				// Else (if there is an argument)
				// Determine what the content of the title should be according if the
				// Command found has an additional Param or not
				let title = commandFound.additionalParam
					? `\`${commandFound.prefix} ${commandFound.additionalParam}\``
					: `\`${commandFound.prefix}\``;

				const embed = new MessageEmbed()
					.setColor('#42f5dd')
					.setTitle(title)
					.addField('Description', commandFound.desc);

				/**
                 * If the command have additionalParam, it will add new
                 * For the options
                 */
				if (commandFound.additionalParam)
					embed.addField('Additional Parameter(s)', commandFound.additionalParam);

				await Data.findOne({ prefix: commandFound.prefix }, (err: any, data: CommandDbType) => {
					if (err) throw err;
					embed.addField('Amount Called in Server', `${data.amountCalled} times`);
				});

				msg.channel.send(embed);
			}
		} catch (err) {
			console.error(err);
		}
	}
};

export default help;
