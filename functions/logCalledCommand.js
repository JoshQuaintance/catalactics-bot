const Discord = require('discord.js');
const client = new Discord.Client();
const lastCalled = require('../data/lastCaller.json');
const commandUsed = require('./commandUsed');

/**
 * Function that will log all the commands that are called
 * @param {Discord.Message} msg Discord Message Object
 * @param {Object} cmd Cmd Object
 * @param {Discord.Channel} ch Channel to log
 */
async function logCommand(msg, cmd, ch) {
    // New function in order to get an async func


		// If the last logged author is not the same as the new author || the last author is empty/undefined
		let checks = lastCalled.author !== msg.author || lastCalled.author == '';
		// If the last logged command prefix is not the same as the new command prefix || the last prefix is empty/undefined
        let checksX = lastCalled.prefix !== cmd.prefix || lastCalled.prefix == '';
        // If the last logged author is the same as the new author AND(&&) the last logged prefix is the same as the new command prefix
		let check2 = lastCalled.author == msg.author && lastCalled.prefix == cmd.prefix;

        let overallCalledAmount = await commandUsed(msg, cmd);

		// check and checksX return true
		if (checks || checksX) {
			lastCalled.author = msg.author;
			lastCalled.prefix = cmd.prefix;
			lastCalled.times = 1;
			const sent = await ch
				.send(
					new Discord.MessageEmbed().setColor('#8238c7').setTitle('Command Called').setDescription(
						`Command: ${cmd.prefix}\n Called By: ${msg.author}\n Called Times: ${lastCalled.times}\n Overall Times Command Called On Server: ${overallCalledAmount}`
					)
				)
				.catch(err => console.error(err));
            lastCalled.id = sent.id;
            // else if check 2 returns true;
		} else if (check2) {
			lastCalled.times++;
			ch.messages
				.fetch(lastCalled.id)
				.then(fetched =>
					fetched.edit(
						new Discord.MessageEmbed().setColor('#8238c7').setTitle('Command Called').setDescription(
							`Command: ${cmd.prefix}\n Called By: ${msg.author}\n Called Times: ${lastCalled.times}\n Overall Times Command Called On Server: ${overallCalledAmount}`
						)
					)
                )
                // If there is an error sending the message log it
				.catch(err => console.log(err));
		}


    // Calls the function
	// sendThem(ch).catch(err => console.log(err));
}

module.exports = logCommand;
