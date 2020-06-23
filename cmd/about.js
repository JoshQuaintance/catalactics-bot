const Discord        = require('discord.js');
const client         = new Discord.Client();
const newMsg         = require("../functions/newMsg.js");
const generateFields = require("../functions/generateEmbedFields");

module.exports = {
    prefix         : "about",
    additionalParam: null,
    description    : "Give the BOT a little description of itself. They deserve some too.",
    command(msg) {
        let moreField = generateFields(
            ["Who made me", "I was made by someone named Catalactics, He is the owner of this server"],
            ["Fact about me", "Fun facts! I was made using Discord.js"],
            ["What can I do", `I can do a number of things, you can get my attention using the \`!\` prefix. To find more about my commands, you can use the \`!commands\` command.`]
        )
        let aboutMsg = newMsg("#4364e8", "Let Me Introduce Myself", "Hello there My name is Catalactics Bot.", moreField)
        .setFooter("That's All, thank you for your attention!")

        msg.channel.send(aboutMsg);
    }
}