const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insult')
		.setDescription('Send a random insult (no hard feelings)')
		.addUserOption(option => option.setName('target')
			.setDescription('The user\'s avatar to show')
			.setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();

		// Get target user
		const target = interaction.options.getUser('target');
		const targetVal = target ? `<@${target.id}>` : '';

		// Fetch an inspirational quote
		const response = await fetch('https://evilinsult.com/generate_insult.php?type=json');
		const data = await response.json();

		// Create the embed with the quote (or an error message if the fetch failed)
		let embed;
		if (response.ok) {
			embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setDescription(`${targetVal} ${data["insult"]}`);
		} else {
			embed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setDescription(`An error has occurred.`);
		}

		await interaction.editReply({
			embeds: [embed],
		});
	},
};