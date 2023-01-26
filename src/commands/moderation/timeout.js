const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Timeouts the member provided.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The member to timeout')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('duration')
				.setDescription('Timeout duration'))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for kicking'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const member = interaction.options.getMember('user');
		const duration = interaction.options.getInteger('duration') ?? null;
		const reason = interaction.options.getString('reason') ?? 'Unspecified';

		await member.timeout(!duration ? null : duration * 60 * 1000, reason).catch(console.error);
		await member.user.send({
			content: `You have been timed out in ${interaction.guild.name}!\nReason: ${reason}`,
		}).catch(console.error);
		await interaction.reply(`Timed out ${member.user.username} for reason: ${reason}`).catch(console.error);
	},
};
