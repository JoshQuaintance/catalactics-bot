const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix } = require("./config.json");

const create = require("./functions.js");
const newMsg = (clr, title, desc) => create.msg(clr, title, desc);

const fs = require("fs");
const cl = (...args) => args.forEach(c => console.log(c));
const uptime = require('./data/uptime.json');

// Grabs Bot Token from .env file
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const token = process.env.DISCORD_TOKEN;
// ----


client.on("ready", () => {
	create.time(uptime);

	cl(`Logged in as ${client.user.tag}`);
	
	let msg = create.msg("#21ed4a", "BOT Online", " ")
	.addField("Logged In", `Successfully Logged in as • ${client.user.tag}`)
	.addField("Online", `Today at ${uptime.uptime} ${uptime.timezone}`)
	.setFooter("Listening for commands");

	client.channels.fetch("721766876916482078").then(ch => ch.send(msg));
});

/**
 * Commands 
 */
let ping = require("./cmd/ping.js");
let roles = require("./cmd/roles.js");

let commandList = [ ping, roles ];

client.on("message", msg => {
	let x = client.channels.fetch("721766876916482078");
	for(let cmd of commandList) {

		let fixed = prefix + cmd.prefix;
		let fixedAlt = `bot ${cmd.prefix}`;

		if(msg.content.startsWith(fixed) || msg.content.startsWith(fixedAlt)) {
			cmd.command(msg);
			create.commandLog(msg, cmd, x)
			break;
		}
	}
});

/**
 * When New Member Arrives
 */
client.on("guildMemberAdd", member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === "introductions");

	let welcomeFields = create.fields([
		["📃 Server Rules", "I have sent you a ✉Direct Message about the server rules, please read and follow the rules... Thank You!"],
		["About me!!", "I'm a just a bot🤖 beep boop. You can get my attention with the prefix `!`. For a list of commands, use the `!commands` command."],
		["Introduce Yourself", "Go ahead and introduce yourself, My owner will make sure to reply to you!! 🙂"]
	])
	let welcomeText = newMsg("#f54269", "A New User Joined Yay🎉, Let's Welcome them!!", `👋 Hello there ${member} and welcome to my Discord Server. Thank you for joining!!!`, welcomeFields);	

	let rules = new Discord.MessageEmbed()
		.setTitle("Rules for My Server")
		.setColor("#f54269")
		.setDescription(
			"Thank you for joining my server, here is the list of rules that we have. Please Read and Follow Them, Thank You!"
		);

	channel.send(welcomeText);
});

client.login(token);
