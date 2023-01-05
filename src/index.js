// Require the necessary discord.js classes
const fs = require('node:fs');
// const { connect } = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require("mongoose");

// Allow access to the environment variables of the running node process
require("dotenv").config();
const { token, databaseToken  } = process.env

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

// Create collections for client
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
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
client.handleComponents();

// Log in to Discord with your client's token
client.login(token);

// Connect to the database
// mongoose.set('strictQuery', false);
// (async () => {
//     // await mongoose.connect(databaseToken).catch(console.error);
//     await mongoose.connect(databaseToken, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(console.log('Connected to Mongodb.'));
// })();