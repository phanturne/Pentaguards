const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

// Importing this allows you to access the environment variables of the running node process
require("dotenv").config();

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.clientId, process.env.guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();


// const fs = require('node:fs');
// const path = require('node:path');
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord.js');
// const { clientId, guildId, token } = require('./config.json');
//
// const rest = new REST({ version: '10' }).setToken(token);
//
// const commands = [];
// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//
// for (const file of commandFiles) {
// 	const filePath = path.join(commandsPath, file);
// 	const command = require(filePath);
// 	commands.push(command.data.toJSON());
// }
//
// rest.put(Routes.applicationCommands(clientId, guildId), { body: commands })
// 	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
// 	.catch(console.error);
//
// // // for global commands
// // rest.put(Routes.applicationCommands(clientId), { body: [] })
// // 	.then(() => console.log('Successfully deleted all application commands.'))
// // 	.catch(console.error);
//
// // // for guild-based commands
// // rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
// // 	.then(() => console.log('Successfully deleted all guild commands.'))
// // 	.catch(console.error);