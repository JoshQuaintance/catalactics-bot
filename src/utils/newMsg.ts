import Discord, { ColorResolvable } from 'discord.js';
const client = new Discord.Client();

/**
 * Creates a new Msg Embed
 */
export default function newMsg(color: ColorResolvable, title: String, desc: String, ...args: any[]): Discord.MessageEmbed {

    // Creates a new Embed
    let msg = new Discord.MessageEmbed()
        .setColor(color || "#7973f0")
        .setTitle(title || "Title not Set")
        .setDescription(desc || "Description Not Set");
    // If new fields are passed, it will add it into the embed;
    if(args.length !== 0) args.forEach(
        field => field.forEach(
            (fd: { name: String; value: String; }) => msg.addField(fd.name, fd.value)
        )
    );

    return msg;
};
