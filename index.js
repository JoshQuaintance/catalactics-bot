const Discord = require('discord.js');
const client = new Discord.Client();
const newMsg = require('./functions/newMsg.js');
const generateFields = require('./functions/generateEmbedFields');
const logCommand = require('./functions/logCalledCommand.js');
const cmdNotFound = require('./functions/notFound.js');
const wakeUpTime = require('./functions/getWakeTime');

const fs = require('fs');
const cl = (...args) => args.forEach(c => console.log(c));

// Grabs Bot Token from .env file
const settings = require('./functions/get-settings.js');
const token = settings.TOKEN;
const prefix = settings.PREFIX;
const mongoose = require('mongoose');
const URI = settings.MONGO_URI;
const botLogCh = settings.BOT_LOG_CHANNEL;

const memberHasPerm = require('./functions/memberHasPerm.js');
// const server   = new mongoose.Schema({
// 	serverName: client.guilds.cache.name
// })
const roleSchema = new mongoose.Schema({
	serverName : { type: String, required: true },
	roleName   : { type: String, required: true },
	roleId     : { type: String, required: true },
	userNum    : Number,
	desc       : String
});

// ----

client.login(token);

client.once('ready', () => {
	const startTime = wakeUpTime();

	cl(`Logged in as ${client.user.tag}`);

	let msg = newMsg('#21ed4a', 'BOT Online', ' ')
		.addField('Logged In', `Successfully Logged in as • ${client.user.tag}`)
		.addField('Online', `Today at ${startTime}`)
		.setFooter('Listening for commands');

	let loggingCh = client.channels.cache.find(ch => ch.name == botLogCh);
	loggingCh.send(msg);
	getAllRoles();
	// client.guilds.cache.forEach(guild => console.log(guild));
});

/**
 * Commands
 */
const uptime = require('./cmd/uptime.js');
const ping = require('./cmd/ping.js');
const roles = require('./cmd/roles.js');
const about = require('./cmd/about.js');
const role = require('./cmd/role.js');
const commands = require('./cmd/commands');
const stats = require('./cmd/stats');
const { TOKEN } = require('./functions/get-settings.js');

let commandList = [ ping, roles, about, uptime, role, commands, stats ];

module.exports = {
	roleSchema  : roleSchema,
	commandList : [ ping, roles, about, uptime, role, commands ],
	ex() {
		console.log(typeof this.commandList);
	}
};

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
					[ 'Get Commands', `You can always find commands available by using the \`${prefix}commands\`.` ]
				);
			else
				field = generateFields([
					'Get Commands',
					`You can always find commands available by using the \`${prefix}commands\`.`
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
				name  : 'Rule 1',
				value : 'Be nice and kind to each other. Please respect each other and do not give hateful comments.'
			},
			{
				name  : 'Rule 2',
				value :
					"Please keep the discussions in it's appropriate channel. If it is considered as not related to the channel, it can be deleted."
			}
		);
	if (channel) channel.send(welcomeText);
	if (!channel) console.log('Channel [bot-logs] is not found');
	member.send(rules);
});

function getAllRoles() {
	client.guilds.cache.forEach(guild => {
		guild.roles.cache.forEach(role => {
			if (role.name == '@everyone') return;

			const Role = mongoose.model('Role', roleSchema, guild.name);

			Role.findOne({ roleId: role.id }, (err, data) => {
				if (err || !data) {
					const newRole = new Role({
						serverName : guild.name,
						roleName   : role.name,
						roleId     : role.id,
						userNum    : 0,
						desc       : 'No Description Added'
					});

					newRole.save(err => {
						if (err) console.error(err);
					});
				} else {
					let num = 0;
					role.members.forEach(member => {
						if(member.user.username) num++;

						data.userNum = num;
					});
					data.save(err => (err ? console.log(err) : undefined));
				}
			});
		});
	});

	// client.guilds.cache.forEach(guild => {
	// 	if(guild.roles.cache.get("721478207181815893") == undefined) return;

	// 	guild.members.cache.forEach(member => {
	// 		let x = member._roles;
	// 		let y = member.user.username;

	// 		x.forEach(roleId => {
	// 			let Role = mongoose.model("Role", roleSchema, guild.name);
	// 			Role.findOne({roleId: roleId}, (err, data) => {
	// 				if(err) return console.log(err);

	// 				data.userNum = 0;
	// 				data.save(err => err ? console.log(err) : undefined);
	// 			})
	// 		})
	// 	})
	// });

	// console.log("All roles added to the Database");
}

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
