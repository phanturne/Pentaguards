const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check your ping.'),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});

		const newMessage = `**API Latency**: \`${client.ws.ping}ms\`\n**Client Ping**: \`${message.createdTimestamp - interaction.createdTimestamp}ms\``;

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription(newMessage);

		await interaction.editReply({
			embeds: [embed],
		});
	},
};