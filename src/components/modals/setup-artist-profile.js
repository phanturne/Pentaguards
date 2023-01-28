const { createArtist } = require('../../tcgHelper/createAccount');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: {
		name: 'setup-artist-profile',
	},
	async execute(interaction, client) {
		const username = interaction.fields.getTextInputValue('username');
		// const profilePic = interaction.fields.getTextInputValue('profilePic');
		const aiModels = interaction.fields.getTextInputValue('aiModels');
		const socials = interaction.fields.getTextInputValue('socials');

		const artistID = await createArtist(interaction, client, username, aiModels, socials);

		const embed = new EmbedBuilder()
			.setColor(0x50C878)
			.setDescription(`
            You have successfully set up your artist profile! 
            
            Use \`/artistprofile\` to update it or add a profile picture.
            `);

		// Add button to view profile
		const artistButton = new ButtonBuilder()
			.setCustomId(`showArtistButton${artistID}`)
			.setLabel('View Profile')
			.setStyle(ButtonStyle.Primary);

		await interaction.reply({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(artistButton)],
			ephemeral: true,
		});
	},
};