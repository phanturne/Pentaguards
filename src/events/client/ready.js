const { setPresence } = require("../../functions/tools/setPresence");

// When the client is ready, run this code (only once)
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await client.setPresence();
        console.log(`Ready! ${client.user.tag} has logged in!`)
    },
};