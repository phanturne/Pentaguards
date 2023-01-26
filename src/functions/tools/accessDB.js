const Profile = require('../../schemas/profileSchema');
const Artist = require('../../schemas/artistSchema');
const Card = require('../../schemas/cardSchema');
const Artwork = require('../../schemas/artworkSchema');
const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
	client.getProfile = async (interaction, user = interaction.user) => {
		const player = await Profile.findOne({ id: user.id });
		if (player) return player;

		const msg = (user === interaction.user) ? 'Please set up an account by typing `/start`.' : `**${user.username}** has not set up their account yet.`;
		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setDescription(msg);
		await interaction.editReply({
			embeds: [embed],
		});
	};

	client.getDiscordArtist = async (interaction) => {
		const artist = await Artist.findOne({ discordID: interaction.user.id });
		if (artist) return artist;
	};

	client.getArtist = async (interaction, artistId) => {
		const artist = await Artist.findOne({ id: artistId });
		if (artist) return artist;

		const msg = 'Invalid artist id.';
		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setDescription(msg);
		await interaction.editReply({
			embeds: [embed],
		});
	};

	client.getCard = async (interaction, cardId) => {
		const card = await Card.findOne({ id: cardId });
		if (card) return card;

		const msg = 'Invalid card id.';
		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setDescription(msg);
		await interaction.editReply({
			embeds: [embed],
		});
	};

	client.getArtwork = async (interaction, artworkId) => {
		const artwork = await Artwork.findOne({ id: artworkId });
		if (artwork) return artwork;

		const msg = 'Invalid artwork id.';
		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setDescription(msg);
		await interaction.editReply({
			embeds: [embed],
		});
	};
};