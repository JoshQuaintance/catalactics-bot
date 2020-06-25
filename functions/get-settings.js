require('dotenv').config();
console.log(process.env.MONGO_URI);

module.exports = {
	// This is the discord token for your BOT. Keep this a secret!!
	TOKEN               : process.env.DISCORD_TOKEN,

	// This is your MongoDB URI, this is also sensitive information, keep it a secret!!
	// It should look something like this
	// ↳ mongodb+srv://[username]:[password]@random.mongodb.net/[dbname]?retryWrites=true&w=majority
	MONGO_URI           : process.env.MONGO_URI,

	// This is the prefix for the bot, this is what the bot looks for. The default prefix is "!".
	// Make sure it's in String form, means it has to be contained inside quotes ("")
	PREFIX              : process.env.PREFIX || '!',

	// This is the name of the channel when a user joined or left the channel is noticed.
	// Put this in String form all lower case. Defaults to "introductions"
	JOIN_LEAVE_CHANNEL  : process.env.JOIN_LEAVE_CHANNEL || 'introductions',

	// This is the name of the channel used to log commands called.
	// Put this in a String form all lowercase. Defaults to "command-logs"
	COMMAND_LOG_CHANNEL : process.env.COMMAND_LOG_CHANNEL || 'command-logs',

	// This is the name of the channel used to log bot activity.
	// Put this in a string form  all lowercase. Defaults to "bot-logs"
	BOT_LOG_CHANNEL     : process.env.BOT_LOG_CHANNEL || 'bot-logs'
};
