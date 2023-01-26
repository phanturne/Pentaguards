const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

// Fetch a random joke from https://github.com/15Dkatz/official_joke_api
function getJoke() {
	return fetch('https://official-joke-api.wl.r.appspot.com/jokes/random')
		.then(res => {
			return res.json();
		})
		.then(data => {
			return '>>> ' + data['setup'] + '\n' + '*' + data['punchline'] + '*';
		});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Sends a random joke'),
	async execute(interaction) {
		await getJoke().then(joke => interaction.reply(joke));
	},
};