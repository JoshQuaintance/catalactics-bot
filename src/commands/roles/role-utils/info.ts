import mongoose from 'mongoose';
import * as moment from 'moment';
import { Message, MessageEmbed, ColorResolvable } from 'discord.js';
import { stripIndents } from 'common-tags';
import { getSettings } from '../../../utils/get-settings';
const URI = getSettings().MONGO_URI;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => (err ? console.log(err) : undefined));

interface PermissionsInt {
    [key: string]: string;
}

const PERMS: PermissionsInt = {
  ADMINISTRATOR: 'Administrator',
  VIEW_AUDIT_LOG: 'View audit log',
  MANAGE_GUILD: 'Manage server',
  MANAGE_ROLES: 'Manage roles',
  MANAGE_CHANNELS: 'Manage channels',
  KICK_MEMBERS: 'Kick members',
  BAN_MEMBERS: 'Ban members',
  CREATE_INSTANT_INVITE: 'Create instant invite',
  CHANGE_NICKNAME: 'Change nickname',
  MANAGE_NICKNAMES: 'Manage nicknames',
  MANAGE_EMOJIS: 'Manage emojis',
  MANAGE_WEBHOOKS: 'Manage webhooks',
  VIEW_CHANNEL: 'Read text channels and see voice channels',
  SEND_MESSAGES: 'Send messages',
  SEND_TTS_MESSAGES: 'Send TTS messages',
  MANAGE_MESSAGES: 'Manage messages',
  EMBED_LINKS: 'Embed links',
  ATTACH_FILES: 'Attach files',
  READ_MESSAGE_HISTORY: 'Read message history',
  MENTION_EVERYONE: 'Mention everyone',
  USE_EXTERNAL_EMOJIS: 'Use external emojis',
  ADD_REACTIONS: 'Add reactions',
  CONNECT: 'Connect',
  SPEAK: 'Speak',
  MUTE_MEMBERS: 'Mute members',
  DEAFEN_MEMBERS: 'Deafen members',
  MOVE_MEMBERS: 'Move members',
  USE_VAD: 'Use voice activity',
};

export default async function info(msg: Message): Promise<void> {
  try
  {
    const mentioned = msg.mentions.roles.first();
    const text = msg.content.split(' ').slice(2).join(' ');

    const role = mentioned == undefined
      ? text == undefined
        ? msg.guild?.roles.cache.find(role => role.name === '@everyone')
        : msg.guild?.roles.cache.find(role => role.name.toLowerCase() == text.toLowerCase())
      : msg.guild?.roles.cache.get(mentioned?.id);

    const permissions = Object.keys(PERMS).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (permission) => role.permissions.serialize()[permission],
    );


    const embed = new MessageEmbed()
      .setColor(role?.hexColor as ColorResolvable)
      .setThumbnail(msg.guild?.iconURL() as string)
      .setDescription(`Info about **${role?.name}**`)
      .addField(
        'Info',
        stripIndents`
          • ID: ${role?.id}
          • Color: ${role?.hexColor} | The color of this embed.
          • Hoisted: ${role?.hoist ? 'Yes' : 'No'}
          • Raw Position: ${role?.rawPosition}
          • Mentionable: ${role?.mentionable ? 'Yes' : 'No'}
          • Date Created: ${moment.utc(role?.createdAt).format('YYYY/MM/DD')}
          • User Amount with Role: ${role?.members.size}
          \u200b
        `)
      .addField(
        'Permissions',
        stripIndents`
          ${permissions.map(permission => `• ${PERMS[permission]}`).join('\n') || 'None'}
        `, true
      );

    msg.channel.send(embed);
  }
  catch (err)
  {
    console.error(err);
  }
}

