const giveMeAJoke = require('give-me-a-joke');
const {SlashCommandBuilder} = require("discord.js");
const {request} = require("undici");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dadjoke")
        .setDescription("Send a random dad joke"),
    async execute(interaction, client) {
        await giveMeAJoke.getRandomDadJoke(function(joke) {
            interaction.reply({
                content: joke
            });
        })
    }
}