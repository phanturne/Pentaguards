const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Display the user\'s profile.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s profile to show')),
	async execute(interaction, client) {
		await interaction.deferReply();

		// Get the player's profile
		const user = interaction.options.getUser('target') ? interaction.options.getUser('target') : interaction.user;
		const player = await client.getProfile(interaction, user);
		if (!player) return;

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`${user.username}'s Profile\t\t\t\u200B`)
			.setThumbnail(user.avatarURL())
			// .setAuthor({ name: user.username, iconURL: user.avatarURL() })
			.addFields(
				{ name: `Date Joined \u200B`, value: player.dateJoined, inline: true },
				{ name: 'Guild     \t\u200B', value: player.guild, inline: true },
				{ name: '          \u200B', value: '\u200B', inline: true },
				{ name: 'Shards\u200B', value: `\`\`\`${player.shards}\`\`\``, inline: true },
				{ name: 'Silver    \t\t\u200B', value: `\`\`\`${player.silver}\`\`\``, inline: true },
				{ name: 'Gold      \t\t\u200B', value: `\`\`\`${player.gold}\`\`\``, inline: true },
				{ name: 'Diamonds', value: `\`\`\`${player.diamond}\`\`\`` },
				{ name: 'Total Cards', value: `\`\`\`${player.cardsList.length}\`\`\`` },
			);

		// @TODO: Add buttons to view wishlist, view cardsList, give gift (viewing lists will also have option to view on website)

		await interaction.editReply({
			embeds: [embed],
		});
	},
};