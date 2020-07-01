const Discord = require('discord.js');
const newMsg = require('../utils/newMsg.js');
const getRepoInfo = require('git-repo-info');
const info = getRepoInfo();
const uptime = require('./uptime').uptime;

require('dotenv').config();

async function stats(msg, client) {
	// The message embed to send
	let embed = newMsg('#FF00FF', 'Catalactics Stats', ' ');

	// Basic infos
	embed.addField('Server Name', `\\>    ${msg.guild}`, true);

	let nums = 0;
	await client.guilds.cache.forEach(guild => {
		nums++;
	});

    embed.addField('Server Count', `\\>    ${nums}`, true);



	// get uptime value
	const time = client.uptime / 1000;
	const up = uptime(time);
	const days = up[0],
		hours = up[1],
		minutes = up[2],
		seconds = up[3];

	embed.addField(`Uptime`, `\\>    ${days} ${hours} ${minutes} ${seconds}`);

	// Get the source version from heroku, if it's not deployed, it will return undefined
	let version = process.env.SOURCE_VERSION;

	// If version is undefined, it will get a different approach locally
	const hash = version == undefined ? info.abbreviatedSha : version.slice(0, 10);

	// Adds a field to the embed
	embed.addField(`Commit Version`, `[${hash}](https://github.com/JoshuaPelealu/catalactics-bot/commit/${hash})`);

	msg.channel.send(embed);
}

module.exports = {
	prefix  : 'stats',
	desc    : 'Shows the status of the bot.',
	command : stats
};
