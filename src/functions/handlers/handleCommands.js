const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');

// Allow access to the environment variables of the running node process
require("dotenv").config();
const { token, clientId, guildId } = process.env

// Process commands
module.exports = (client) => {
	client.handleCommands = async () => {
		const { commands, commandsArray } = client
		const commandPath = `${__dirname}/../../commands`
		const commandFolders = fs.readdirSync(commandPath)
		for (const folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`${commandPath}/${folder}`)
				.filter((file) => file.endsWith(".js"))

			for (const file of commandFiles) {
				const command = require(`${commandPath}/${folder}/${file}`);
				commands.set(command.data.name, command);
				commandsArray.push(command.data.toJSON());
			}
		}

		// Construct and prepare an instance of the REST module
		const rest = new REST({ version: '10' }).setToken(token);

		// // Delete all previous guild-based commands
		// rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: [] })
		// 	.then(() => console.log('✅ Successfully deleted all previous guild commands.'))
		// 	.catch(console.error);
		//
		// // Delete all previous global commands
		// rest.put(Routes.applicationCommands(process.env.clientId), { body: [] })
		// 	.then(() => console.log('✅ Successfully deleted all previous application commands.'))
		// 	.catch(console.error);

		// Deploy the commands
		try {
			console.log(`Started refreshing ${commandsArray.length} application (/) commands from ${commandFolders.length} categories.`);

			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(Routes.applicationCommands(clientId, guildId), {
				body: commandsArray,
			});

			console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			// Catch and log any errors!
			console.error(error);
		}
	}
}
