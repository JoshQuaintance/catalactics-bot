import Discord from 'discord.js';
import { Client, TextChannel } from 'discord.js';
const client = new Client();
import newMsg from './utils/newMsg';
import generateFields from './utils/generateEmbedFields';
import logCommand from './utils/logCalledCommand';
import cmdNotFound from './utils/notFound';
import wakeUpTime from './utils/getWakeTime';
import { promises } from 'fs';
const { readdir } = promises;

const cl = (...args: any[]) => args.forEach(c => console.log(c));

/**
 * Settings
 */
import { getSettings } from './utils/get-settings.js';
const token = getSettings().TOKEN;
const prefix = getSettings().PREFIX;
const mongoose = require('mongoose');
const URI = getSettings().MONGO_URI;
const botLogCh = getSettings().BOT_LOG_CHANNEL;


/**
 * Schemas for MongoDB
 */
const roleSchema = new mongoose.Schema({
	serverName: { type: String, required: true },
	roleName: { type: String, required: true },
	roleId: { type: String, required: true },
	rawPosition: Number,
	userNum: Number,
	desc: String
});

const commandUsageSchema = new mongoose.Schema({
	prefix: { type: String, required: true },
	amountCalled: Number
});

// ----

// Login
client.login(token);

/**
 * When the bot is ready (Up), it will log some active embed
 */
client.once('ready', () => {
	const startTime: string = wakeUpTime();

	cl(`Logged in as ${client.user!.tag}`);

	let msg: Discord.MessageEmbed = newMsg('#21ed4a', 'BOT Online', ' ')
		.addField('Logged In', `Successfully Logged in as • ${client.user!.tag}`)
		.addField('Online', `Today at ${startTime}`)
		.setFooter('Listening for commands');

	let loggingCh = client.channels.cache.find(ch => (ch as TextChannel).name == botLogCh);
    (loggingCh! as TextChannel).send(msg);
	getAllRoles();
	setAllCommands();
	// client.guilds.cache.forEach(guild => console.log(guild));
});

/**
 * Commands
 * TODO : Change way of getting commands into using files, instead of objects.
 */
import { uptime } from './cmd/uptime';
import { ping } from './cmd/ping';
import { roles } from './cmd/roles';
import { about } from './cmd/about';
const role = require('./cmd/role.js');
const help = require('./cmd/help');
const stats = require('./cmd/stats');
const { TOKEN } = require('./utils/get-settings.js');

let commandList = [ ping, roles, about, uptime, role, help, stats ];

client.on('message', msg => {
	if (msg.author.bot) return;
    let x = client.channels.cache.find(ch => ch.name == 'command-logs');
	if (msg.content.startsWith(prefix)) {
		for (var cmd of commandList) {
			var startsWith = x => msg.content.startsWith(x);
			var msgArray = msg.content.split(' ');

			const command = msgArray[0];
			var cmdRun = command.slice(1);

			if (cmdRun == cmd.prefix) {
				cmd.command(msg, client);
				logCommand(msg, cmd, x);
				break;
			}
		}

		if (cmdRun !== cmd.prefix && !msg.author.bot) {
			let closeTo = cmdNotFound(commandList, msg.content);
			let field;

			if (closeTo.length > 0)
				field = generateFields(
					[ 'Did you mean?', `\`${closeTo}\`` ],
					[ 'Get Commands', `You can always find commands available by using the \`${prefix}help\`.` ]
				);
			else
				field = generateFields([
					'Get Commands',
					`You can always find commands available by using the \`${prefix}help\`.`
				]);

			let sryEmbed = newMsg(
				'#eb4034',
				'Command Not Found!',
				`I'm sorry ${msg.author}, I cannot find a command with the prefix of \`${msg.content}\``,
				field
			);

			msg.channel.send(sryEmbed);
		}
	}
});

/**
 * When New Member Arrives
 */
client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'introductions');

	let welcomeFields = generateFields(
		[
			'📃 Server Rules',
			'I have sent you a ✉Direct Message about the server rules, please read and follow the rules... Thank You!'
		],
		[
			'About me!!',
			"I'm a just a bot🤖 beep boop. You can get my attention with the prefix `!`. For a list of commands, use the `!commands` command."
		],
		[ 'Introduce Yourself', 'Go ahead and introduce yourself, My owner will make sure to reply to you!! 🙂' ]
	);
	let welcomeText = newMsg(
		'#f54269',
		"A New User Joined Yay🎉, Let's Welcome them!!",
		`👋 Hello there ${member} and welcome to my Discord Server. Thank you for joining!!!`,
		welcomeFields
	);

	let rules = new Discord.MessageEmbed()
		.setTitle('Rules for My Server')
		.setColor('#f54269')
		.setDescription(
			'Thank you for joining my server, here is the list of rules that we have. Please Read and Follow Them, Thank You!'
		)
		.addFields(
			{
				name: 'Rule 1',
				value: 'Be nice and kind to each other. Please respect each other and do not give hateful comments.'
			},
			{
				name: 'Rule 2',
				value:
					"Please keep the discussions in it's appropriate channel. If it is considered as not related to the channel, it can be deleted."
			}
		);
	if (channel) channel.send(welcomeText);
	if (!channel) console.log('Channel [bot-logs] is not found');
	member.send(rules);
});

/**
 * Everytime a role is updated/changed in anyway,
 * it will update necessary information for the database
 */
client.on('roleUpdate', (old, updated) => {
	let Role = mongoose.model('Data', roleSchema, updated.guild.name);

	Role.findOne({ roleId: updated.id }, (err, data) => {
		data.rawPosition = updated.rawPosition;
		data.save(err => {
			if (err) throw err;
		});
	});
});

function getAllRoles() {
	client.guilds.cache.forEach(guild => {
		guild.roles.cache.forEach(role => {
			// console.log(role.name, role.rawPosition);

			if (role.name == '@everyone') return;

			/**
             * Adding roles into databases
             */
			const Role = mongoose.model('Data', roleSchema, guild.name);

			Role.findOne({ roleId: role.id }, (err, data) => {
				if (err || !data) {
					const newRole = new Role({
						serverName: guild.name,
						roleName: role.name,
						roleId: role.id,
						rawPosition: role.rawPosition,
						userNum: 0,
						desc: 'No Description Added'
					});

					newRole.save(err => {
						if (err) console.error(err);
					});
				} else {
					let num = 0;
					data.rawPosition = role.rawPosition;
					role.members.forEach(member => {
						if (member.user.username) num++;
						data.userNum = num;
					});
					data.save(err => (err ? console.log(err) : undefined));
				}
			});
		});
	});
}

/**
 * Store all commands
 */
async function setAllCommands() {
	const results = await readdir('./cmd/');
	await results.forEach(file => {
		const filename = file;
		const lookup = require(`./cmd/${filename}`);

		// Get all the guilds the bot is in, and for every guild it's on
		client.guilds.cache.forEach(guild => {
			// Get collection
			const Role = mongoose.model('Commands', commandUsageSchema, guild.name);

			// Find the specific command using the prefix.
			Role.findOne({ prefix: lookup.prefix }, (err, data) => {
				// If the command is not in the database yet
				if (err || !data) {
					const newCmd = new Role({
						prefix: lookup.prefix,
						amountCalled: 0
					});

					newCmd.save(err => {
						if (err) console.log(err);
					});
				} else return;
			});
		});
	});
}

/**
 * Exports some necessary variables
 */
export {
	roleSchema,
	commandUsageSchema,
	getAllRoles
};

/*
guild.roles.cache.forEach(role => {
		Role.findOne({roleId: role.id}, (err, data) => {
			if(err || !data) {
				const newRole = new Role({
					serverName: guild,
					roleName  : roleName,
					roleId    : roleId,
					desc      : description
				});

				newRole.save(err => {
					if (err) return console.log(err);
				});

				console.log("Roles added");
			} else return;
		});})
*/

/**
 * I don't know why you're looking at this
 * @param {Object} msg Message object to show.
 */
function whyYouHere(msg) {}
