const fs = require('fs');
const Discord = require('discord.js');
const newMsg = require("../functions/newMsg.js");
// const getRepoInfo = require('git-repo-info');
// const info = getRepoInfo();
require('dotenv').config();
console.log(process.env.SOURCE_VERSION)

function stats(msg) {
    const hash = process.env.SOURCE_VERSION;

    let embed = newMsg("#FF00FF", "Commit hash", hash);
    msg.channel.send(embed);
}

module.exports = {
    prefix: "stats",
    additionalParam: null,
    desc: "Stats",
    command: stats
}
