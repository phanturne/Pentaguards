const { Events } = require('discord.js');

// When the client is ready, run this code (only once)
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};