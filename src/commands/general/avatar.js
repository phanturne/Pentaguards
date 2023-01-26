const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		const msg = user ? `${user.username}'s avatar:` : `Your avatar:`;
		const avatar = user ? user.avatarURL() : interaction.user.avatarURL();

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription(`**${msg}**`)
			.setImage(avatar);

		interaction.reply({
			embeds: [embed],
		});
	},
};