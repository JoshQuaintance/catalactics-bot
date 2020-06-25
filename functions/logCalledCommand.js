const Discord = require('discord.js');
const client = new Discord.Client();
const lastCalled = require('../data/lastCaller.json');

/**
 * Function that will log all the commands that are called
 * @param {Discord.Message} msg Discord Message Object
 * @param {Object} cmd Cmd Object
 * @param {Discord.Channel} ch Channel to log 
 */
function logCommand(msg, cmd, ch) {
        
    async function sendThem(channel){
        

         let checks = lastCalled.author !== msg.author || lastCalled.author  == "";
         let checksX = lastCalled.prefix !== cmd.prefix || lastCalled.prefix == "";
         let check2 = lastCalled.author == msg.author && lastCalled.prefix == cmd.prefix;

         if(checks || checksX) {
             lastCalled.author = msg.author;
             lastCalled.prefix = cmd.prefix;
             lastCalled.times = 1;
             const sent = await channel.send(new Discord.MessageEmbed()
             .setColor("#8238c7")
             .setTitle("Command Called")
             .setDescription(
             `Command: ${cmd.prefix}
             Called By: ${msg.author}
             Called Times: ${lastCalled.times}`)).catch(err => console.error(err));
             lastCalled.id = sent.id;
         } else if (check2) {
             lastCalled.times++
             channel.messages.fetch(lastCalled.id).then(got => got.edit(new Discord.MessageEmbed()
             .setColor("#8238c7")
             .setTitle("Command Called")
             .setDescription(
             `Command: ${cmd.prefix}
             Called By: ${msg.author}
             Called Times: ${lastCalled.times}`))).catch(err => console.error(err));
         }

     }

    sendThem(ch);
}

module.exports = logCommand;