import { Message, MessageEmbed } from 'discord.js';
import mongoose from 'mongoose';
import { commandSchema } from '../../utils/schemas';
import { CommandsDbInt, CommandsType } from '../../utils/interfaces';
import { stripIndents } from 'common-tags';

export const help: CommandsType = {
	prefix: 'help',
	additionalParam: '[Command]',
	desc:
        "Displays all of the commands available. If a command is specified, it will display the description of the command. That's this command",
    category: 'Utility',
	/**
     * Get all the commands and display it.
     * @param {Discord.Message} msg Message Object
     */
	command: async function getAllCommands(msg, { settings, CommandList }) {
		try {
			// Connect to the database using the URI from the variable file.
			mongoose.connect(settings.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
				throw err;
			});
			const Data = mongoose.model('Commands', commandSchema, msg.guild!.toString());

			// Gets the argument
			let splitMsg = msg.content.split(' ')[1];

			// Finds the command using the prefix and return the object.
			const commandFound = CommandList.find((command: any) => command.prefix == splitMsg);

			// If there is no argument, it's going to send the full list
			if (splitMsg == undefined || commandFound == undefined) {
				let embedMsg = new MessageEmbed()
					.setColor('#23f0c7')
					.setTitle('List of Commands')
					.setDescription(
						`Hey there ${msg.author}, Here's a full list of all the commands. \n For more information about each commands, type \`${settings.PREFIX}help <command>\``
					);



					let command: any[] = [];
					CommandList.forEach(cmd => {
						if (!cmd.prefix) return;
						command.push(`\`${cmd.prefix}\``);
					});
					let allCmd = command.join(' ');

					embedMsg.addField(`All Commands`, allCmd);

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

				if (commandFound.args) {
                    embed.addField('`Options`',
                    stripIndents`
                    ${commandFound.args.map(arg => '•' + arg.options).join('\n')}
                    `)
				}


                if (commandFound.additionalParam)
                    embed.addField('\u200b', 'Required: `<>` | Optional: `[]` \n\u200b');

                if (commandFound.examples) {
                    let fields: string[] = [];
                    (commandFound.examples as string[]).forEach((ex: string) => {
                        fields.push(`\`${ex}\``);
                    });
                    fields.push('\u200b')
                    embed.addField('Examples', fields.join('\n'))
                }

                await Data.findOne({ prefix: commandFound.prefix }, (err: any, data: CommandsDbInt) => {
                        if (err) throw err;

                        embed.addField('Amount Called in Server', `${data.amountCalled} times`);
                    }
                );

				msg.channel.send(embed);
			}
		} catch (err) {
			console.error(err);
		}
	}
};

export default help;
