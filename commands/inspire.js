const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

// Fetch a random quote from Zen Quotes
function getQuote() {
    return fetch("https://zenquotes.io/api/random")
    .then(res => {
        return res.json();
    })
    .then(data => {
        return ">>> *\"" + data[0]["q"] + "*\"\n — " + data[0]["a"];
    })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inspire')
		.setDescription('Sends a random inspirational quote'),
	async execute(interaction) {
		await getQuote().then(quote => interaction.reply(quote));
	},
};