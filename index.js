// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Importing this allows you to access the environment variables of the running node process
require("dotenv").config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Add slash commands to Collection
client.commands = new Collection();

// Return an array of file names of Javascript files in the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Process slash commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Return an array of file names of Javascript file in the events directory
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Process events
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(process.env.token);



// // Require the necessary classes
// const { Client, Collection, GatewayIntentBits } = require('discord.js');
// const { clientId, guildId, token } = require('./config.json');
// const Database = require("@replit/database");
// const fs = require("node:fs");
// const path = require('node:path');
//
// // Create a new client instance
// const client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.MessageContent,
//     ]
// });
//
// // Adds slash commands to Collection
// client.commands = new Collection();
// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//
// // Processes slash commands
// for (const file of commandFiles) {
//     const filePath = path.join(commandsPath, file);
//     const command = require(filePath);
//     // Set a new item in the Collection w/ key = command name, value = module
//     client.commands.set(command.data.name, command);
// }
//
// const db = new Database();
//
// // Converts a file to an array
// const fileToArray = filename =>
//     fs.readFileSync(filename).toString('UTF8').split('\n');
//
// const sadWords = fileToArray("sadWords.txt");
// const starterEncouragements = fileToArray("encouragements.txt");
//
// // Initialize the list of encouragements
// db.get("encouragements").then(encouragements => {
//     if (!encouragements || encouragements.length < 1) {
//         db.set("encouragements", starterEncouragements);
//     }
// })
//
// // Initialize responding state to true
// db.get("responding").then(value => {
//     if (value == null) {
//         db.set("responding", true);
//     }
// })
//
// // Adds a custom encouragement
// function updateEncouragements(encouragingMessage) {
//     db.get("encouragements").then(encouragements => {
//         encouragements.push(encouragingMessage);
//         db.set("encouragements", encouragements);
//     })
// }
//
// // Delete a custom encouragement
// function deleteEncouragement(index) {
//     db.get("encouragements").then(encouragements => {
//         if (encouragements.length > index) {
//               encouragements.splice(index, 1);
//               db.set("encouragements", encouragements);
//         }
//     })
// }
//
// // When the client is ready, run this code once
// client.once("ready", () => {
//     console.log(`Logged in as ${client.user.tag}!`);
//
//     // @TODO:
//     db.set("encouragements", starterEncouragements);
// });
//
// client.on('interactionCreate', async interaction => {
//     if (!interaction.isChatInputCommand()) return;
//
//     // Fetch the command in the Collection
//     const command = interaction.client.commands.get(interaction.commandName);
//
//     if (!command) return; // Exit early if the command does not exist
//
//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
//     }
// })
//
// // @TODO: Convert to slash commands and move to their own files
// client.on("messageCreate", msg => {
//     // Prevents the bot from responding to its own messages
//     if (msg.author.bot) return;
//
//     // Reply to the user with an encouragement if a sad word is detected
//     db.get("responding").then(responding => {
//         if (responding && sadWords.some(word => msg.content.toLowerCase().includes(word))) {
//             db.get("encouragements").then(encouragements => {
//                 const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
//                 msg.reply(encouragement);
//             })
//         }
//     })
//
//     // If the user is bored, ask if they want to play a game or hear a joke
//     if (msg.content.toLowerCase().includes("bored")) {
//         msg.reply("> Would you like to hear a joke or play a game?");
//         // @TODO: implement buttons
//     }
//
//     // $new [encouragingMessage]: Adds a custom encouraging message
//     if (msg.content.startsWith("$new")) {
//         encouragingMessage = msg.content.split("$new ")[1];
//         updateEncouragements(encouragingMessage);
//         msg.channel.send("New encouraging message added: " + "\"" + encouragingMessage + "\"");
//     }
//
//     // $del [index]: Deletes an encouraging message
//     if (msg.content.startsWith("$del")) {
//         encouragingMessage = parseInt(msg.content.split("$del ")[1]);
//         deleteEncouragement(encouragingMessage);
//         msg.channel.send("Encouraging message deleted.");
//     }
//
//     if (msg.content.startsWith("$list")) {
//         db.get("encouragements").then(encouragements => {
//             for (let i = 0; i < encouragements.length; i++) {
//                 msg.channel.send(encouragements[i]);
//             }
//         })
//     }
//
//     if (msg.content.startsWith("$responding")) {
//         value = msg.content.split("$responding ")[1];
//
//         if (value.toLowerCase() == "on") {
//             db.set("responding", true);
//             msg.channel.send("Responding is on.");
//         } else {
//             db.set("responding", false);
//             msg.channel.send("Responding is off.");
//         }
//     }
// });
//
// // Log in to Discord with your client's token
// client.login(token);
