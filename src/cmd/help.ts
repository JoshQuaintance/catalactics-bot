import { Message, MessageEmbed } from 'discord.js';
import { CMD } from './commands';
// import { promises } from 'fs';
import { getSettings } from '../utils/get-settings';
import mongoose from 'mongoose';
import { commandUsageSchema } from '../index';
import { CommandDbType } from '../utils/db-defs/commandDB.int';
import { CommandsType } from '../utils/cmd-def.int';

// const { readdir } = promises;
// Settings
const prefix = getSettings().PREFIX;
const URI = getSettings().MONGO_URI;

// Connect to the database using the URI from the variable file.
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

/**
 * Get the top 4 commands with the most called times.
 */
async function getPopularCommands(msg: Message) {
	let guild = msg.guild?.toString();

	const Data = mongoose.model('Commands', commandUsageSchema, guild);
    let sorted: any;

	await Data.find({}, (err: any, data: CommandDbType[]) => {
        if (err) throw err;

        let filtered = data.filter(doc => typeof doc.prefix == 'string');
        sorted = filtered.sort((a, b) => b.amountCalled - a.amountCalled).slice(0, 4);
    });
    console.log(sorted + "Sorted")
    return sorted;
}

/**
 * Get all the commands and display it.
 * @param {Discord.Message} msg Message Object
 */
export const help: CommandsType = {
	prefix          : 'help',
	additionalParam : '[Command]',
	desc            :
		"Displays all of the commands available. If a command is specified, it will display the description of the command. That's this command",
	command         :  async function getAllCommands(msg: Message) {
        try {
            let embedMsg = new MessageEmbed()
			.setColor('#23f0c7')
			.setTitle('List of Commands')
			.setDescription(`Hey there ${msg.author}, I have sent you the full list of all the commands available. Here's a short list of the common commands.`);

            let cmdMsg = new MessageEmbed()
                .setColor('#23f0c7')
                .setTitle('Full List of All The Commands Available')
                .setDescription(`Hello there, here is the full list of all the commands available. If you want to call me, you can do so using the prefix \`${prefix}\``)

            await getPopularCommands(msg).then(fulfilled => {
                fulfilled.forEach((cmd: any) => {
                    let lookup = CMD.find(look => cmd.prefix == look.prefix);
                    embedMsg.addField(lookup!.prefix, lookup!.desc);
                });
            });


            CMD.forEach(file => {

                if (file.prefix && file.desc)
                    cmdMsg.addField(file.prefix, file.desc);
            });


            msg.author.send(cmdMsg);
            msg.channel.send(embedMsg);
        } catch (err) {
            console.error(err);
        }
     }

};

