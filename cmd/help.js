const { promises } = require('fs');
const { readdir } = promises;
const settings = require('../functions/get-settings.js');
const prefix = settings.PREFIX;
const newMsg = require('../functions/newMsg.js');
const URI = settings.MONGO_URI;
const mongoose = require('mongoose');
const main = require('../index.js');
const commandUsageSchema = main.commandUsageSchema;

// Connect to the database using the URI from the variable file.
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err));

/**
 * Get the top 4 commands with the most called times.
 */
async function getPopularCommands(msg) {
	let guild = msg.guild;

	const Data = mongoose.model('Commands', commandUsageSchema, guild);
    let sorted;

	await Data.find({}, (err, data) => {
		if (err) return console.log(err);

        let filtered = data.filter(doc => typeof doc.prefix == 'string');
        sorted = filtered.sort((a, b) => b.amountCalled - a.amountCalled).slice(0, 4);
        
    });

    return sorted;
}

/**
 * Get all the commands and display it.
 * @param {Discord.Message} msg Message Object
 */
async function getAllCommands(msg) {
	let embedMsg = newMsg(
		'#23f0c7',
		'List of Commands',
		`Hey there ${msg.author}, I have sent you the full list of all the commands available. Here's a short list of the common commands.`
	);
	let cmdMsg = newMsg(
		'#23f0c7',
		'Full List of All The Commands Available',
		`Hello there, here is the full list of all the commands available. If you want to call me, you can do so using the prefix \`${prefix}\``
	);
	let fields = await getPopularCommands(msg);

	const results = await readdir(__dirname);
	await results.forEach(file => {
		const filename = file;
		const lookup = require(`./${filename}`);

		if (lookup.prefix && lookup.desc) cmdMsg.addField(lookup.prefix, lookup.desc);
    });

    await fields.forEach(cmd => {
        const lookup = require(`./${cmd.prefix}`);
        embedMsg.addField(lookup.prefix, lookup.desc);
    });

	msg.author.send(cmdMsg);
	msg.channel.send(embedMsg);
}

module.exports = {
	prefix          : 'help',
	additionalParam : '[Command]',
	desc            :
		"Displays all of the commands available. If a command is specified, it will display the description of the command. That's this command",
	command         : getAllCommands
};
