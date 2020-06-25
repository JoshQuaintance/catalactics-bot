const fs = require('fs');
const Discord = require('discord.js');
const newMsg = require("../functions/newMsg.js");

function stats(msg) {
    let hash;
    let filename;
    const rev = fs.readFileSync('.git/HEAD').toString();
    if(rev.indexOf(':') === -1) 
        return rev;
     else 
         filename = rev.slice(5).match(/./g).join("").toString(),
         hash = fs.readFileSync('.git/' + filename);
     
    
    let embed = newMsg("#FF00FF", "Commit hash", hash);
    msg.channel.send(embed);
}

module.exports = {
    prefix: "stats",
    additionalParam: null,
    desc: "Stats",
    command: stats
}