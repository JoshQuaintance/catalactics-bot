import dotenv from 'dotenv';
dotenv.config();

export interface Settings {
    // This is the discord token for your BOT. Keep this a secret!!
	TOKEN               : string;

	// This is your MongoDB URI, this is also sensitive information, keep it a secret!!
	// It should look something like this
	// mongodb+srv://[username]:[password]@random.mongodb.net/[dbname]?retryWrites=true&w=majority
	MONGO_URI           : string;

	// This is the prefix for the bot, this is what the bot looks for. The default prefix is "!".
	// Make sure it's in String form, means it has to be contained inside quotes ("")
	PREFIX              : string;

	// This is the name of the channel when a user joined or left the channel is noticed.
	// Put this in String form all lower case. Defaults to "introductions"
	JOIN_LEAVE_CHANNEL  : string;

	// This is the name of the channel used to log commands called.
	// Put this in a String form all lowercase. Defaults to "command-logs"
	COMMAND_LOG_CHANNEL : string;

	// This is the name of the channel used to log bot activity.
	// Put this in a string form  all lowercase. Defaults to "bot-logs"
    BOT_LOG_CHANNEL     : string;

    // If you want the bot to log all the command that is
    // called
    LOG_COMMAND         : boolean;

    // If you want the bot to log when it is online,
    // 'true' or 'false'
    LOG_WHEN_ONLINE     : boolean;
}

/**
 * @name getSettings
 * Get necessary settings for the bot
 *
 * @returns Config Object
 */
export function getSettings(): Settings {
    return {
        TOKEN               : process.env.DISCORD_TOKEN || '',
	    MONGO_URI           : process.env.MONGO_URI || '',
        PREFIX              : process.env.PREFIX || '!',
        JOIN_LEAVE_CHANNEL  : process.env.JOIN_LEAVE_CHANNEL || 'introductions',
        COMMAND_LOG_CHANNEL : process.env.COMMAND_LOG_CHANNEL || 'command-logs',
        BOT_LOG_CHANNEL     : process.env.BOT_LOG_CHANNEL || 'bot-logs',
        LOG_COMMAND         : process.env.LOG_COMMAND === 'true',
        LOG_WHEN_ONLINE     : process.env.LOG_WHEN_ONLINE === 'true'
    }
};
