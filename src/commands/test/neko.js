const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

// @TODO: replace with neko api
module.exports = {
	data: new SlashCommandBuilder()
		.setName('neko')
		.setDescription('Sends a random image of a neko'),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const nekoResult = await request('https://aws.random.cat/meow');
		const { file } = await nekoResult.body.json();
		await interaction.editReply({ files: [{ attachment: file, name: 'neko.png' }] });
	},
};