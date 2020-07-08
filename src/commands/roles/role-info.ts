import { Message, MessageEmbed } from 'discord.js';
import mongoose from 'mongoose';
import { getSettings } from '../../utils/get-settings';
import { roleSchema } from '../../index';
import { RolesDbInt, CommandsType } from '../../utils/interfaces';
const URI = getSettings().MONGO_URI;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => (err ? console.log(err) : undefined));

const role_info: CommandsType = {
    prefix: 'role-info',
    additionalParam: '<Role>',
    desc: 'Give an info about the role',
    category: 'Information',
    command: msg => {
        let role = msg.content.split(' ')[1];
        let roleId = role == undefined ? undefined : role.match(/\d/g)!.join('');
        let roleFound = roleId == undefined
            ? msg.guild?.roles.cache.find(role => role.name === "@everyone")
            : msg.guild!.roles.cache.get(roleId!);
        let guildName = msg.guild!.toString();

    }
}

export default role_info;
