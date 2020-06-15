const Discord = require("discord.js");
const client = new Discord.Client();
const lastCalled = require('./data/lastCaller.json');

const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const token = process.env.DISCORD_TOKEN;
client.login(token)

module.exports = {
    commandLog(msg, cmd, ch) {
        
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
                Called Times: ${lastCalled.times}`));
                lastCalled.id = sent.id;
            } else if (check2) {
                lastCalled.times++
                channel.messages.fetch(lastCalled.id).then(got => got.edit(new Discord.MessageEmbed()
                .setColor("#8238c7")
                .setTitle("Command Called")
                .setDescription(
                `Command: ${cmd.prefix}
                Called By: ${msg.author}
                Called Times: ${lastCalled.times}`)))
            }

        }

        ch.then(channel => sendThem(channel))
    },
    // creates new message embed
	msg(color, title, desc, ...args) {
        // Creates a new Embed
		let msg = new Discord.MessageEmbed()
			.setColor(color || "#7973f0")
			.setTitle(title || "")
            .setDescription(desc || "No Description???");
        // If new fields are passed, it will add it into the embed
        args.forEach(field => field.forEach(fd => msg.addField(fd.name, fd.value)));
        
		return msg;
    },
    
    fields(arr) {
        let combined = [];
        arr.forEach(arr => combined.push(this.makeObj(arr[0], arr[1])) )
        
        return combined;
    },

    makeObj(name, value) {
        return {name: name, value: value}
    },

    time(log) {
        let date = new Date();
        let hour = date.getHours(),
		    mins = date.getMinutes(),
		    secs = date.getSeconds(),
            tz = /\((.*)\)/.exec(new Date().toString())[1];
        let am_pm = hour >= 12 ? "PM" : "AM";
        hour = hour < 10 ? `0${date.getHours()}` : date.getHours();
        mins = mins < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        secs = secs < 10 ? `0${date.getSeconds()}` : date.getSeconds();

        let time = `${hour}:${mins} ${am_pm}`;
        log.uptime = time;
        log.timezone = tz;
    }   
};
