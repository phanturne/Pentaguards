const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { cardDropImage } = require('./cardDropImage');

module.exports = {
	async showCard(interaction, client, cardId) {
		// Find the card info from the database.
		const card = await client.getCard(interaction, cardId);
		if (!card) return;

		// Parse card information
		const artwork = await client.getArtwork(interaction, card.artworkID);
		const attachment = await cardDropImage(1, [cardInfo], [frameInfo]);
		const collection = card.group;
		const aiModel = card.aiModel;
		const fullArt = card.fullArt ? `[Source](${card.fullArt})` : 'N/A';

		// Create buttons
		const artworkInfo = new ButtonBuilder()
			.setCustomId('artworkInfo')
			.setLabel('Artwork Info')
			.setStyle(ButtonStyle.Primary);

		const cardStats = new ButtonBuilder()
			.setCustomId('cardStats')
			.setLabel('Card Stats')
			.setStyle(ButtonStyle.Primary);

		let buttons;
		if (fullArt) {
			const fullArtButton = new ButtonBuilder()
				.setCustomId('fullArtButton')
				.setLabel('Full Art')
				.setURL(fullArt)
				.setStyle(ButtonStyle.Link);

			buttons = new ActionRowBuilder().addComponents(artworkInfo, cardStats, fullArtButton);
		}
		else {
			buttons = new ActionRowBuilder().addComponents(artworkInfo, cardStats);
		}

		// Send embed with card name and basic information
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(cardInfo.name)
			.setImage(`attachment://cards.png`)
			.setFooter({ text: `Owned by ${card.ownerName}` })
			.addFields([
				{ name: `Card ID        \u200B`, value: `#${card.id}`, inline: true },
				{ name: `Print Number`, value: `#${card.printNumber}`, inline: true },
				{ name: `Condition   \u200B`, value: card.condition, inline: true },
			]);

		const message = await interaction.reply({
			embeds: [embed],
			files: [attachment],
		});

		// Create button collector
		const collector = await message.createMessageComponentCollector({
			componentType: ComponentType.Button,
		});

		// Collect button interactions
		collector.on('collect', async (i) => {
			// await i.deferUpdate();
			switch (i.customId) {
			case 'artworkInfo':
				// Send embed with artwork information
				const artInfoEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(cardInfo.name)
					.addFields([
						{ name: `Artist          \u200B`, value: card.artist, inline: true },
						{ name: `AI Model        \u200B`, value: aiModel, inline: true },
						{ name: `Date Added      \u200B`, value: card.dateAdded, inline: true },
						{ name: `Frame           \u200B`, value: frameInfo.name, inline: true },
						{ name: `Rarity`, value: card.rarity, inline: true },
						{ name: `Style           \u200B`, value: card.style, inline: true },
						{ name: `Category`, value: card.category, inline: true },
						{ name: `Collection`, value: collection, inline: true },
					]);

				await interaction.followUp({ embeds: [artInfoEmbed] });
				artworkInfo.setDisabled(true);
				break;
			case 'cardStats':
				// Send embed with card stats
				const cardStatsEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(cardInfo.name)
					.addFields([
						{ name: `Artist          \u200B`, value: card.artist, inline: true },
						{ name: `AI Model        \u200B`, value: aiModel, inline: true },
						{ name: `Date Added      \u200B`, value: card.dateAdded, inline: true },
						{ name: `Frame           \u200B`, value: frameInfo.name, inline: true },
						{ name: `Rarity`, value: card.rarity, inline: true },
						{ name: `Style           \u200B`, value: card.style, inline: true },
						{ name: `Category`, value: card.category, inline: true },
						{ name: `Collection`, value: collection, inline: true },
					]);

				await interaction.followUp({ embeds: [cardStatsEmbed] });
				cardStats.setDisabled(true);
				break;
			case 'fullArtButton':
				break;
			default:
				throw console.error;
			}

			await additionalInfo(interaction, cardSubmission, artwork);
		});
	},

	async showArtist(interaction, client, artistId) {
		const artist = await client.getArtist(interaction, artistId);
		if (!artist) return;

		// Create a list of social media buttons
		const row = new ActionRowBuilder().addComponents(getSocialButtons(artist));

		let embed;
		embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`${artist.artist}'s Profile`)
			.setThumbnail(artist.profilePic ? artist.profilePic : 'https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png')
			.addFields([
				{ name: `Artist ID`, value: `#${artist.id}`, inline: true },
				{ name: `AI Models`, value: artist.aiModels ? artist.aiModels : 'Unknown', inline: true },
			]);

		if (row.components.length > 0) {
			await interaction.reply({
				embeds: [embed],
				components: [row],
			});
		}
		else {
			await interaction.reply({
				embeds: [embed],
			});
		}
	},
};

function buildButton(label, URL) {
	return new ButtonBuilder()
		.setLabel(label)
		.setURL(URL)
		.setStyle(ButtonStyle.Link);
}

function getSocialButtons(profile) {
	const buttons = [];
	if (profile.pixiv) buttons.push(buildButton('Pixiv', profile.pixiv));
	if (profile.pixivFanbox) buttons.push(buildButton('Pixiv Fanbox', profile.pixivFanbox));
	if (profile.artStation) buttons.push(buildButton('ArtStation', profile.artStation));
	if (profile.deviantArt) buttons.push(buildButton('DeviantArt', profile.deviantArt));
	if (profile.instagram) buttons.push(buildButton('Instagram', profile.instagram));
	if (profile.twitter) buttons.push(buildButton('Twitter', profile.twitter));
	if (profile.patreon) buttons.push(buildButton('Patreon', profile.patreon));
	if (profile.xiaohongshu) buttons.push(buildButton('小红书', profile.xiaohongshu));

	return buttons;
}