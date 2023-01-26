const { SlashCommandBuilder } = require('discord.js');
const { showArtist } = require('../../tcgHelper/showInfo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('artist')
		.setDescription('Display the profile card of a specific artist')
		.addStringOption(option =>
			option.setName('id')
				.setDescription('Artist ID to search for')
				.setRequired(true)),
	async execute(interaction, client) {
		const artistId = interaction.options.getString('id');
		await showArtist(interaction, client, artistId);
	},
};
