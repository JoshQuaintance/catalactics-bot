const settings = require("../functions/get-settings.js");
const URI      = settings.MONGO_URI;
const mongoose = require("mongoose");
const main     = require("../index.js");
const newMsg = require('./newMsg.js');
const commandUsageSchema = main.commandUsageSchema;

// Connect to the database using the URI from the variable file.
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err));

/**
 * Store to the database the the command is used.
 * @param {Discord.Message} msg Message object
 * @param {Object } cmd Command object function
 */
async function commandUsed(msg, cmd) {
    // variable to return later.
    let amountToEmbed;

    // Get the collection
    const Role = mongoose.model('Commands', commandUsageSchema, msg.guild);

    // Find the document from the collection by it's prefix using the command's prefix
    await Role.findOne({ prefix: cmd.prefix }, (err, data) => {
        // If there is an error getting the document throw it
        if(err) return console.log(err);

        // Add 1 to the amount to show later, so it will show.
        amountToEmbed = data.amountCalled + 1;

        // Adds 1 to the amountCalled in the database.
        data.amountCalled++;

        // Save the data that was modified.
        data.save(err => {
            if(err) throw err;
        });

    });

    // Returns the amount
    return amountToEmbed;

}

module.exports = commandUsed;
