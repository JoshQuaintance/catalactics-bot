const settings = require("../utils/get-settings.js");
const URI      = settings.MONGO_URI;
const mongoose = require("mongoose");
const main     = require("../index.js");
const newMsg = require('./utils/newMsg.js');
const commandUsageSchema = main.commandUsageSchema;

// Connect to the database using the URI from the variable file.
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => (err ? console.log(err) : undefined));

/**
 * Get command usage amount for later use.
 * @param {Discord.Message} msg Discord Message Object
 * @param {Object} cmd Command Object
 */
async function getCommandUsage(msg, cmd) {

    // Variable for returning the value
    let amount;

    // Get the collection.
    const Role = mongoose.model('Data', commandUsageSchema, msg.guild);


         /**
          * Find the command specified using it's prefix
          * cmd.prefix = prefix of the command specified
          */
        await Role.findOne({ prefix: cmd.prefix }, (err, data) => {
            // If there is an error, throw it.
            if(err) console.log(err);
            amount = data.amountCalled;
        });

    return amount;
}

module.exports = getCommandUsage;
