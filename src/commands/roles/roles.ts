import { getSettings } from '../../utils/get-settings';
import { roleSchema } from '../../index';
import { RolesDbInt, CommandsType } from '../../utils/interfaces';
import { MessageEmbed } from 'discord.js';
import mongoose from 'mongoose';
const URI = getSettings().MONGO_URI;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err: string) => console.error(err));

export const roles: CommandsType = {
  prefix: 'roles',
  desc: 'Gives a list of the roles and a little description of what they do',
  category: 'Information',
  command: async msg => {
    try {
      const msgText = new MessageEmbed()
        .setColor('#2a57eb')
        .setTitle('Role List')
        .setDescription(`Hey there ${msg.author}, here's a list of the roles and what they do.`);

      const Role = mongoose.model('Data', roleSchema, msg.guild?.name);

      await Role.find({}, (err: never, data: RolesDbInt[]) => {
        if (err) return console.log(err);

        const sorted = data.sort((a, b) => b.rawPosition - a.rawPosition);

        sorted.forEach(role => {
          if (role.roleId == undefined) return;
          else msgText.addField(role.roleName, `<@&${role.roleId}> - ${role.desc}`);
        });
        // console.log(msgText);
      });
      // console.log(msgText);
      msg.channel.send(msgText);
    } catch (err) {
      console.error(err);
    }
  }
};

export default roles;
