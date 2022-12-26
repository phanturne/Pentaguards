const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require("dotenv").config(); // Allow access to the environment variables of the running node process

// Grab all the command files from each subdirectory of the commands directory
const commands = [];
const commandFolders = fs.readdirSync("./Commands/");
console.log(`Loading a total of ${commandFolders.length} categories.`);
commandFolders.forEach(async (dir) => {
	const folder = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
	for (const file of folder) {
		const command = require(`./commands/${dir}/${file}`);
		commands.push(command.data.toJSON());
	}
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.token);

// Deploy the commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.clientId, process.env.guildId),
			{ body: commands },
		);

		console.log(`Successfully registered ${data.length} application (/) commands.`);
	} catch (error) {
		// Catch and log any errors!
		console.error(error);
	}
})();
