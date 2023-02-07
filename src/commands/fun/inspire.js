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

		// Create the embed with the quote (or an error message if the fetch failed)
		let embed;
		if (response.ok) {
			embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setDescription(`${data['content']} — ${data['author']}`);
		}
		else {
			embed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setDescription(`An error has occurred.`);
		}

		await interaction.editReply({
			embeds: [embed],
		});
	},
};