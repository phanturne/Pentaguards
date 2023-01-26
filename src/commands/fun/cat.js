const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Sends a random cat picture.'),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const catResult = await request('https://aws.random.cat/meow');
		const { file } = await catResult.body.json();
		await interaction.editReply({ files: [{ attachment: file, name: 'cat.png' }] });
	},
};