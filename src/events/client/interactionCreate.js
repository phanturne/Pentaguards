const { Events, InteractionType } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			// Get matching command from client.commands
			const command = client.commands.get(interaction.commandName);

			// If no matching command is found, log the error to the error and ignore the event
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			// Call the command's execute(). Catch any log any errors to the console.
			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		}
		else if (interaction.isButton()) {
			// Hacky way to use pass the card/artist ID to the "showCardButton"
			let customId = interaction.customId.startsWith('showCardButton') ? 'showCardButton' : interaction.customId;
			customId = interaction.customId.startsWith('showArtistButton') ? 'showArtistButton' : customId;

			const button = client.buttons.get(customId);
			if (!button) return new Error('Button has not been set up.');

			try {
				await button.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an error with this button!',
					ephemeral: true,
				});
			}
		}
		else if (interaction.isStringSelectMenu()) {
			const menu = client.selectMenus.get(interaction.customId);
			if (!menu) return new Error('Select menu has not been set up.');

			try {
				await menu.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an error with this select menu!',
					ephemeral: true,
				});
			}
		}
		else if (interaction.type === InteractionType.ModalSubmit) {
			const modal = client.modals.get(interaction.customId);
			if (!modal) return new Error('Modal has not been set up');

			try {
				await modal.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an error with this modal!',
					ephemeral: true,
				});
			}
		}
		else if (interaction.isContextMenuCommand()) {
			// Get matching command from client.commands
			const contextCommand = client.commands.get(interaction.commandName);

			// If no matching command is found, log the error to the error and ignore the event
			if (!contextCommand) {
				console.error(`No context command matching ${interaction.commandName} was found.`);
				return;
			}

			// Call the command's execute(). Catch any log any errors to the console.
			try {
				await contextCommand.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an error with this context menu!',
					ephemeral: true,
				});
			}
		}
		else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			// Get matching command from client.commands
			const command = interaction.client.commands.get(interaction.commandName);

			// If no matching command is found, log the error to the error and ignore the event
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			// Call the command's execute(). Catch any log any errors to the console.
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}
	},
};