const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inspire')
		.setDescription('Sends a random inspirational quote'),
	async execute(interaction) {
		await interaction.deferReply();

		// Fetch an inspirational quote
		const response = await fetch('https://api.quotable.io/random');
		const data = await response.json();

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription(`${data["content"]} — ${data["author"]}`);
		await interaction.editReply({
			embeds: [embed],
		});
	},
};