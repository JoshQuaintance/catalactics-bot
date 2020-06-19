const Discord = require('discord.js');
const client = new Discord.Client();

/**
 * Creates a new Msg Embed
 * @param {string} color 
 * @param {string} title 
 * @param {string} desc 
 * @param  {...any} args 
 */
function newMsg(color, title, desc, ...args) {
    // Creates a new Embed
    let msg = new Discord.MessageEmbed()
        .setColor(color || "#7973f0")
        .setTitle(title || "Title not Set")
        .setDescription(desc || "Description Not Set");
    // If new fields are passed, it will add it into the embed;
    if(args.length !== 0) args.forEach(field => field.forEach(fd => msg.addField(fd.name, fd.value)));
    
    return msg;
}

module.exports = newMsg;