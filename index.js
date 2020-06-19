const Discord        = require("discord.js");
const client         = new Discord.Client();
const newMsg         = require("./functions/newMsg.js");
const generateFields = require("./functions/generateEmbedFields");
const logCommand     = require("./functions/logCalledCommand.js");
const cmdNotFound    = require("./functions/notFound.js");
const { prefix }     = require("./config.json");
const wakeUpTime     = require("./functions/getWakeTime");

const fs = require("fs");
const cl = (...args) => args.forEach(c => console.log(c));

// Grabs Bot Token from .env file
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const token = process.env.DISCORD_TOKEN;
// ----
client.login(token);

client.on("ready", () => {
	const startTime = wakeUpTime();

	cl(`Logged in as ${client.user.tag}`);

	let msg = newMsg("#21ed4a", "BOT Online", " ")
		.addField("Logged In", `Successfully Logged in as • ${client.user.tag}`)
		.addField("Online", `Today at ${startTime}`)
		.setFooter("Listening for commands");

	client.channels.fetch("721766876916482078").then(ch => ch.send(msg));
});

/**
 * Commands 
 */
const uptime = require("./cmd/uptime.js");
const ping   = require("./cmd/ping.js");
const roles  = require("./cmd/roles.js");
const about  = require("./cmd/about.js");

let commandList = [ ping, roles, about, uptime ];
client.on("message", msg => {
	let x = client.channels.fetch("721766876916482078");
	if (msg.content.startsWith(prefix)) {
		for (var cmd of commandList) {
			var startsWith = x => msg.content.startsWith(x);
			var msgArray   = msg.content.split(" ");

			const command = msgArray[0];
			var   cmdRun  = command.slice(1);

			if (cmdRun == cmd.prefix) {
				cmd.command(msg, client);
				logCommand(msg, cmd, x);
				break;
			}
		}

		if (cmdRun !== cmd.prefix && !msg.author.bot) {
			let closeTo = cmdNotFound(commandList, msg.content);
			let field   = generateFields(
				[ "Did you mean?", `\`${closeTo}\`` ],
				[ "Get Commands", `You can always find commands available by using the \`${prefix}command\`.` ]
			);
			let sryEmbed = newMsg(
				"#eb4034",
				"Command Not Found!",
				`I'm sorry ${msg.author}, I cannot find a command with the prefix of \`${msg.content}\``,
				field
			);
			msg.channel.send(sryEmbed);
		}
	}
});

/**
 * When New Member Arrives
 */
client.on("guildMemberAdd", member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === "introductions");

	let welcomeFields = generateFields(
		[
			"📃 Server Rules",
			"I have sent you a ✉Direct Message about the server rules, please read and follow the rules... Thank You!"
		],
		[
			"About me!!",
			"I'm a just a bot🤖 beep boop. You can get my attention with the prefix `!`. For a list of commands, use the `!commands` command."
		],
		[ "Introduce Yourself", "Go ahead and introduce yourself, My owner will make sure to reply to you!! 🙂" ]
	);
	let welcomeText = newMsg(
		"#f54269",
		"A New User Joined Yay🎉, Let's Welcome them!!",
		`👋 Hello there ${member} and welcome to my Discord Server. Thank you for joining!!!`,
		welcomeFields
	);

	let rules = new Discord.MessageEmbed()
		.setTitle("Rules for My Server")
		.setColor("#f54269")
		.setDescription(
			"Thank you for joining my server, here is the list of rules that we have. Please Read and Follow Them, Thank You!"
		)
		.addFields(
			{
				name  : "Rule 1",
				value : "Be nice and kind to each other. Please respect each other and do not give hateful comments."
			},
			{
				name  : "Rule 2",
				value :
					"Please keep the discussions in it's appropriate channel. If it is considered as unrelatable to the channel, it can be deleted."
			}
		);
	if (channel) channel.send(welcomeText);
	if (!channel) console.log("Channel [bot-logs] is not found");
});
