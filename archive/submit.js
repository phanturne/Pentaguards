const {
	SlashCommandBuilder,
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Submit a card, border, or general '),
	async execute(interaction, client) {
		const modal = new ModalBuilder()
			.setCustomId(`submit-modal`)
			.setTitle(`Community Card Submission`);

		const cardName = new TextInputBuilder()
			.setCustomId(`cardName`)
			.setLabel(`Card Name`)
			.setRequired(false)
			.setPlaceholder('Choose a name for the card')
			.setStyle(TextInputStyle.Short);

		const cardArtist = new TextInputBuilder()
			.setCustomId(`cardArtist`)
			.setLabel(`Artist`)
			.setRequired(true)
			.setPlaceholder('Choose a name for the card')
			.setStyle(TextInputStyle.Short);

		const ai_model = new TextInputBuilder()
			.setCustomId(`ai_model`)
			.setLabel(`AI Model`)
			.setRequired(true)
			.setPlaceholder('ex. Midjourney, DALLE-2')
			.setStyle(TextInputStyle.Short);

		const cardImage = new TextInputBuilder()
			.setCustomId(`cardImage`)
			.setLabel(`Card Image URL`)
			.setRequired(true)
			.setPlaceholder('Link the URL to a 360 x 540 px image.')
			.setStyle(TextInputStyle.Short);

		const comments = new TextInputBuilder()
			.setCustomId(`comments`)
			.setLabel(`Additional Information`)
			.setRequired(false)
			.setPlaceholder('Include comments, prompt used, and/or image source.')
			.setStyle(TextInputStyle.Paragraph);

		const row1 = new ActionRowBuilder().addComponents(cardName);
		const row2 = new ActionRowBuilder().addComponents(cardArtist);
		const row3 = new ActionRowBuilder().addComponents(ai_model);
		const row4 = new ActionRowBuilder().addComponents(cardImage);
		const row5 = new ActionRowBuilder().addComponents(comments);

		// Add inputs to the modal
		modal.addComponents(row1, row2, row3, row4, row5);

		// Show the modal to the user
		await interaction.showModal(modal);
	},
};
