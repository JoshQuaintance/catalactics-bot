import Discord, { Client, TextChannel, MessageEmbed } from 'discord.js';
import logCommand from './utils/logCalledCommand';
import cmdNotFound from './utils/notFound';
import wakeUpTime from './utils/getWakeTime';
import { RolesDbInt,CommandsType } from './utils/interfaces';
import mongoose from 'mongoose';
import chalk from 'chalk';

let CommandList: CommandsType[] = [];
const client = new Client();
import { getAllCommands } from './commands/commands';

/**
 * Settings
 */
import { getSettings } from './utils/get-settings';
const settings = getSettings();
const token = settings.TOKEN;
const prefix = settings.PREFIX;

/**
 * Schemas for MongoDB
 */
import { commandSchema, roleSchema } from './utils/schemas';

// Login
client.login(token);
/**
 * When the bot is ready (Up), it will log some active embed
 */
client.once('ready', async () => {
  await getAllCommands.then(COMMANDS => CommandList = (COMMANDS as CommandsType[]));
  getAllRoles();
  setAllCommands();
  const startTime: string | undefined | null = wakeUpTime();
  console.log(chalk.green(`Logged in as ${client.user?.tag}`));

  if (settings.LOG_WHEN_ONLINE) {
    const msg: Discord.MessageEmbed = new MessageEmbed()
      .setColor('#21ed4a')
      .setTitle('BOT Online')
      .addField('Logged In', `Successfully Logged in as • ${client.user?.tag}`)
      .addField('Online', `Today at ${startTime}`)
      .setFooter('Listening for commands');

    const loggingCh = client.channels.cache.find(ch => (ch as TextChannel).name == getSettings().BOT_LOG_CHANNEL);
    (loggingCh as TextChannel).send(msg);
  } else return;
});

/**
 * Commands
 */
client.on('message', msg => {
  if (msg.author.bot) return;
  const logChannel = settings.COMMAND_LOG_CHANNEL;
  const commandLogChannel = client.channels.cache.find(ch => (ch as TextChannel).name == logChannel);
  if (msg.content.startsWith(prefix)) {
    let commandIsFound = false;
    const cmdRun: string = msg.content.split(' ')[0].slice(1);

    // eslint-disable-next-line no-var
    for (var cmd of CommandList) {

      if (cmdRun == cmd.prefix) {
        cmd.command(msg, { client, settings, CommandList});
        logCommand(msg, cmd, commandLogChannel as Discord.Channel);
        commandIsFound = true;
        break;
      } else if (cmd.alias && cmd.alias.length > 0) {
        cmd.alias?.forEach(other => {
          if (cmdRun == other) {
            cmd.command(msg, { client, settings, CommandList }, other);
            logCommand(msg, cmd, commandLogChannel as Discord.Channel);
            return commandIsFound = true;
          }
        });
      }
    }

    if (!commandIsFound) {
      const closeTo = cmdNotFound(CommandList, msg.content);
      const sryEmbed = new MessageEmbed()
        .setColor('#eb4034')
        .setTitle('Command Not Found!')
        .setDescription(
          `I'm sorry ${msg.author}, I cannot find a command with the prefix of \`${prefix}${cmdRun}\``
        );

      if (closeTo.length > 0)
        sryEmbed.addFields(
          {
            name: 'Did you mean?',
            value: `\`${closeTo}\``
          },
          {
            name: 'Get Commands',
            value: `You can always find commands available by using the \`${prefix}help\`.`
          }
        );
      else
        sryEmbed.addField(
          'Get Commands',
          `You can always find commands available by using the \`${prefix}help\`. \n For more information about each command you can type \`${prefix}help <command>\``
        );

      msg.channel.send(sryEmbed);
    }
  }
});

/**
 * When New Member Arrives
 */
client.on('guildMemberAdd', member => {
  try {
    const joinLeaveCh = settings.JOIN_LEAVE_CHANNEL;
    const channel = member.guild.channels.cache.find(ch => ch.name === joinLeaveCh);

    const welcomeText = new MessageEmbed()
      .setColor('#f54269')
      .setTitle('A New User Joined!! Yay 🎉... Let\'s Welcome them!!')
      .setDescription(`👋 Hello there ${member} and welcome to my Discord Server. Thank you for joining!!!`)
      .addFields(
        {
          name: '📃 Server Rules',
          value:
						'I have sent you a ✉Direct Message about the server rules, please read and follow the rules... Thank You!'
        },
        {
          name: 'About me!!',
          value:
						`I'm a just a bot🤖 beep boop. You can get my attention with the prefix \`${prefix}\`. For a list of commands, use the \`${prefix}help\` command.`
        },
        {
          name: 'Introduce Yourself',
          value: 'Go ahead and introduce yourself, My owner will make sure to reply to you!! 🙂'
        }
      );

    const rules = new Discord.MessageEmbed()
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
						'Please keep the discussions in it\'s appropriate channel. If it is considered as not related to the channel, it can be deleted.'
        }
      );
    if (channel) return (channel as TextChannel).send(welcomeText);
    if (!channel) throw `Channel [${settings.JOIN_LEAVE_CHANNEL}] is not found`;

    member.send(rules);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Everytime a role is updated/changed in anyway,
 * it will update necessary information for the database
 */
client.on('roleUpdate', (_old, updated) => {
  try {
    const Role = mongoose.model('Data', roleSchema, updated.guild.name);

    Role.findOne({ roleId: updated.id }, (err: never, data: RolesDbInt) => {
      if (err) throw err;

      data.rawPosition = updated.rawPosition;

      data.save((err: never) => {
        if (err) throw new Error('Failed Saving : ' + err);
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

        Role.findOne({ roleId: role.id }, (err: never, data: RolesDbInt) => {
          if (err || !data) {
            const newRole = new Role({
              serverName: guild.name,
              roleName: role.name,
              roleId: role.id,
              rawPosition: role.rawPosition,
              userNum: 0,
              desc: 'No Description Added'
            });

            newRole.save((err: unknown) => {
              if (err) throw err;
            });
          } else {
            data.rawPosition = role.rawPosition;

            data.userNum = role.members.size;

            data.save((err: never) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Store all commands
 */
function setAllCommands() {
  try {
    CommandList.forEach(file => {
      // console.log(file);
      // Get all the guilds the bot is in, and for every guild it's on
      client.guilds.cache.forEach(guild => {
        // Get collection
        const Role = mongoose.model('Commands', commandSchema, guild.name);


        // Find the specific command using the prefix.
        Role.findOne({ prefix: file.prefix }, (err: never, data: CommandsType) => {
          // If the command is not in the database yet
          if (err || !data) {
            const NEW_COMMAND = new Role({
              prefix: file.prefix,
              amountCalled: 0
            });

            NEW_COMMAND.save((err: string | undefined) => {
              if (err) throw new Error(err);
            });
          } else return;
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
}

import { stripIndents } from 'common-tags';

export async function updateReadme(flags: string[]): Promise<void> {
  await client.login(token);
  await getAllCommands.then(COMMANDS => CommandList = (COMMANDS as CommandsType[]));
  const tableData = stripIndents`
    ## Commands Available
    | Prefix | Description |
    | :-: | :-: |
    ${CommandList.map(command => '| ' + command.prefix + ' | ' + command.desc + ' |').join('\n')}

    ## Dependencies
    `;
  await import('fs').then(async fs => {
    const path: string = flags[0] == undefined ? '' : flags[0] + '/';
    const data = fs.readFileSync(`${path}README.md`, 'utf-8');
    console.log(data);
    const results = data.replace(/## Commands Available.*## Dependencies/gs, tableData);

    fs.writeFileSync(`${path}README.md`, results, 'utf-8');

  }).catch(err => {
    console.error(err);
    process.exit();
  });

  console.log('Job Done, Exiting now...');
  client.destroy();
  process.exit();
}

/**
 * Exports some necessary variables
 */
export { roleSchema, commandSchema, getAllRoles };

