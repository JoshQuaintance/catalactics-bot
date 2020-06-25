
const { promises } = require('fs');
const { readdir }  = promises;
const settings     = require("../functions/get-settings.js");
const prefix       = settings.PREFIX;
const newMsg       = require("../functions/newMsg.js");


async function getAllCommands(msg) {
    
    let embedMsg = newMsg("#23f0c7", "List of Commands", `Hey there ${msg.author}, I have sent you the full list of all the commands available. Here's a short list of the common commands.`);
    let cmdMsg = newMsg("#23f0c7", "Full List of All The Commands Available", `Hello there, here is the full list of all the commands available. If you want to call me, you can do so using the prefix \`${prefix}\``);
    const results = await readdir(__dirname);
    await results.forEach(file => {
        const filename = file;
        const lookup = require(`./${filename}`);

        if(lookup.prefix && lookup.desc)
            cmdMsg.addField(lookup.prefix, lookup.desc);

        
        if(lookup.prefix == "ping" || lookup.prefix == "commands" || lookup.prefix == "uptime")
            embedMsg.addField(lookup.prefix, lookup.desc);
        
    });

    msg.author.send(cmdMsg);
    msg.channel.send(embedMsg);
}

module.exports = {
    prefix: "commands",
    additionalParam: null,
    desc: "Displays all of the commands available. That's this command",
    command: getAllCommands
}  
