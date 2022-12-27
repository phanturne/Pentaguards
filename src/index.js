// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Allow access to the environment variables of the running node process
require("dotenv").config();
const { token } = process.env

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Create a collection to store slash commands
client.commands = new Collection()
client.commandsArray = [];

// Process functions (events, commands)
const functionPath = `${__dirname}/functions`
const functionFolders = fs.readdirSync(functionPath)
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`${functionPath}/${folder}`)
        .filter((file) => file.endsWith(".js"))

    for (const file of functionFiles) {
        require(`${functionPath}/${folder}/${file}`)(client);
    }
}

client.handleEvents();
client.handleCommands();

// Log in to Discord with your client's token
client.login(token);