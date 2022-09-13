const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

// Fetch a random insult
function getInsult() {
    return fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
    .then(res => {
        return res.json();
    })
    .then(data => {
        return ">>> " + data["insult"];
    })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insult')
		.setDescription('Sends a random insult'),
	async execute(interaction) {
		await getInsult().then(insult => interaction.reply(insult));
	},
};