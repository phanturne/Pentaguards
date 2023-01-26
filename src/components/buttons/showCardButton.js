const { showCard } = require('../../tcgHelper/showInfo');

module.exports = {
	data: {
		name: 'showCardButton',
	},
	async execute(interaction) {
		// Card ID is appended to the end of the button's custom ID
		const idLen = 'showCardButton'.length;
		await showCard(interaction, interaction.customId.substring(idLen));
	},
};