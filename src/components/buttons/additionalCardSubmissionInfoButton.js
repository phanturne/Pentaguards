const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: {
		name: 'additionalCardSubmissionInfoButton',
	},
	async execute(interaction) {
		// Create modal to ask for AI Model and art name
		const modal = new ModalBuilder()
			.setCustomId(`additional-card-info`)
			.setTitle(`Additional Card Info`);

		const cardName = new TextInputBuilder()
			.setCustomId(`cardName`)
			.setLabel(`Card Name`)
			.setRequired(true)
			.setPlaceholder('Choose a name for the card')
			.setStyle(TextInputStyle.Short);

		const aiModel = new TextInputBuilder()
			.setCustomId(`aiModel`)
			.setLabel(`AI Model`)
			.setRequired(true)
			.setPlaceholder('ex. Midjourney, Stable Diffusion, NovelAI, DALLE-2')
			.setStyle(TextInputStyle.Short);

		const row1 = new ActionRowBuilder().addComponents(cardName);
		const row2 = new ActionRowBuilder().addComponents(aiModel);

		// Add inputs to the modal
		modal.addComponents(row1, row2);

		// Show the modal to the user
		await interaction.showModal(modal);
	},
};