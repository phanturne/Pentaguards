const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks the member provided.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The member to kick')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for kicking'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const member = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') ?? 'Unspecified';

		if (!member) {
			return interaction.reply({
				content: 'That was not a valid member.',
				ephemeral: true,
			});
		}

		await member.user.send({
			content: `You have been kicked from ${interaction.guild.name}!\nReason: ${reason}`,
		}).catch(console.error);

		await interaction.reply(`Kicking ${member.user.username} for reason: ${reason}`);
		await member.kick()
			.then()
			.catch(console.error);
	},
};
