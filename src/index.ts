import Discord, { Message, Client, TextChannel, MessageEmbed } from 'discord.js';
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
import { role } from './cmd/role';
import { help } from './cmd/help';
import { stats } from './cmd/stats';
import RoleType from './utils/db-defs/roleDB.int';
import { CommandsType } from './utils/cmd-def.int';
// import { getSettings } from './utils/get-settings';

let commandList = [ ping, roles, about, uptime, role, help, stats ];

client.on('message', msg => {
	if (msg.author.bot) return;
    let x = client.channels.cache.find(ch => (ch as TextChannel).name == 'command-logs');
	if (msg.content.startsWith(prefix)) {
		for (var cmd of commandList) {

			var msgArray = msg.content.split(' ');

			const command = msgArray[0];
			var cmdRun: string = command.slice(1);

			if (cmdRun == cmd.prefix) {
				cmd.command(msg, client);
				logCommand(msg, cmd, (x as Discord.Channel));
				break;
			}
		}

		if (cmdRun! !== cmd!.prefix && !msg.author.bot) {
			let closeTo = cmdNotFound(commandList, msg.content);
			let sryEmbed = new MessageEmbed()
                .setColor('#eb4034')
                .setTitle('Command Not Found!')
                .setDescription(`I'm sorry ${msg.author}, I cannot find a command with the prefix of \`${msg.content}\``,)


			if (closeTo.length > 0)
				sryEmbed.addFields(
                    {
                        name: 'Did you mean?',
                        value: `\`${closeTo}\``
                    },
                    {
                        name: 'Get Commands',
                        value: `You can always find commands available by using the \`${prefix}\`help.`
                    }
                )
            else
                sryEmbed.addField('Get Commands',`You can always find commands available by using the \`${prefix}help\`.`)

			msg.channel.send(sryEmbed);
		}
	}
});

/**
 * When New Member Arrives
 */
client.on('guildMemberAdd', member => {
    try {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'introductions');

        let welcomeText = new MessageEmbed()
            .setColor('#f54269')
            .setTitle('A New User Joined!! Yay 🎉... Let\'s Welcome them!!')
            .setDescription(`👋 Hello there ${member} and welcome to my Discord Server. Thank you for joining!!!`)
            .addFields(
                {
                    name: '📃 Server Rules',
                    value: 'I have sent you a ✉Direct Message about the server rules, please read and follow the rules... Thank You!'
                },
                {
                    name: 'About me!!',
                    value: "I'm a just a bot🤖 beep boop. You can get my attention with the prefix `!`. For a list of commands, use the `!commands` command."
                },
                {
                    name: 'Introduce Yourself',
                    value: 'Go ahead and introduce yourself, My owner will make sure to reply to you!! 🙂'
                }
            )

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
        if (channel) return (channel as TextChannel).send(welcomeText);
        if (!channel) throw `Channel [${getSettings().JOIN_LEAVE_CHANNEL}] is not found`;

        member.send(rules);

    } catch (err) {
        console.error(err);
    }
});


/**
 * Everytime a role is updated/changed in anyway,
 * it will update necessary information for the database
 */
client.on('roleUpdate', (old, updated) => {
    try {
        let Role = mongoose.model('Data', roleSchema, updated.guild.name);

        Role.findOne({ roleId: updated.id }, (err: any, data: RoleType) => {
            if (err) throw err;

            data.rawPosition = updated.rawPosition;

            data.save((err: any) => {
                if (err) throw 'Failed Saving : ' + err;
            });

        });
    } catch (err) {
        console.error(err);
    }

});

function getAllRoles(): void {
    try {
        client.guilds.cache.forEach(guild => {
            guild.roles.cache.forEach(role => {
                if (role.name == '@everyone') return;

                /**
                 * Adding roles into databases
                 */
                const Role = mongoose.model('Data', roleSchema, guild.name);

                Role.findOne({ roleId: role.id }, (err: any, data: RoleType) => {
                    if (err || !data) {
                        const newRole = new Role({
                            serverName: guild.name,
                            roleName: role.name,
                            roleId: role.id,
                            rawPosition: role.rawPosition,
                            userNum: 0,
                            desc: 'No Description Added'
                        });

                        newRole.save((err: any) => {
                            if (err) throw err;
                        });

                    } else {

                        let num = 0;
                        data.rawPosition = role.rawPosition;

                        role.members.forEach(member => {
                            if (member.user.username) num++;
                            data.userNum = num;
                        });

                        data.save((err: any) =>{
                            if (err) throw err;
                        });

                    }
                });
            });
        });

    } catch (err) {
        console.error(err);
    }

};

/**
 * Store all commands
 */
async function setAllCommands() {
    try {
        const results = await readdir('./cmd/');
        await results.forEach(file => {
            const filename = file;
            const lookup = require(`./cmd/${filename}`);

            // Get all the guilds the bot is in, and for every guild it's on
            client.guilds.cache.forEach(guild => {
                // Get collection
                const Role = mongoose.model('Commands', commandUsageSchema, guild.name);

                // Find the specific command using the prefix.
                Role.findOne({ prefix: lookup.prefix }, (err: any, data: CommandsType) => {
                    // If the command is not in the database yet
                    if (err || !data) {
                        const newCmd = new Role({
                            prefix: lookup.prefix,
                            amountCalled: 0
                        });

                        newCmd.save((err: any) => {
                            if (err) console.log(err);
                        });
                    } else return;
                });
            });
        });
    } catch (err) {
        console.error(err);
    }

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
