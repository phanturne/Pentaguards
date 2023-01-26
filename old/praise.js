const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

// Fetch a random praise from https://complimentr.com/api
function getPraise() {
	return fetch('https://complimentr.com/api')
		.then(res => {
			return res.json();
		})
		.then(data => {
			return '>>> ' + data['compliment'];
		});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('praise')
		.setDescription('Sends a random compliment'),
	async execute(interaction) {
		await getPraise().then(praise => interaction.reply(praise));
	},
};