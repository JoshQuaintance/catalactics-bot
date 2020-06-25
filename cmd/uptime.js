const Discord = require('discord.js');
const newMsg = require("../functions/newMsg.js");

function uptime(time) {
    let totalSeconds = time;
    let days = Math.floor(totalSeconds / 86400) <= 0 ? "" : Math.floor(totalSeconds / 86400) < 10 ? `0${Math.floor(totalSeconds / 86400)} days` : `${Math.floor(totalSeconds / 86400)} days`;

    let hours = Math.floor(totalSeconds / 3600) <= 0 ? "" : Math.floor(totalSeconds / 3600) < 10 ? `0${Math.floor(totalSeconds / 3600)} hours` : `${Math.floor(totalSeconds / 3600)} hours`;

    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60) <= 0 ? "" : Math.floor(totalSeconds / 60) < 10 ? `0${Math.floor(totalSeconds / 60)}  minutes` : `${Math.floor(totalSeconds / 60)} minutes`;

    let seconds = Math.floor(totalSeconds % 60) < 10 ? `0${Math.floor(totalSeconds % 60)} seconds` : `${Math.floor(totalSeconds % 60)} seconds`;
	
    
    return [days, hours, minutes, seconds]
}

module.exports = {
	prefix          : "uptime",
	secPrefix       : "up",
	additionalParam : null,
	desc            : "Shows the uptime of the bot",
	command         : function(msg, client) {
		let totalSeconds = client.uptime / 1000;
		let up = uptime(totalSeconds)
		let days = up[0],
			hours = up[1],
			minutes = up[2],
			seconds = up[3];

		let j = new Discord.MessageEmbed()
			.setColor("#cf43e8")
			.setTitle("Uptime")
			.setDescription(" ")
			.addField("Bot Uptime", `${days} ${hours} ${minutes} ${seconds}`);

		msg.channel.send(j);
	}
};
