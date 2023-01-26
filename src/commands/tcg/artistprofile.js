const { SlashCommandBuilder } = require('discord.js');
const { createArtistModal } = require('../../tcgHelper/createArtistModal');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('artistprofile')
		.setDescription('Update your artist profile.'),
	async execute(interaction) {
		await createArtistModal(interaction);
	},
};


