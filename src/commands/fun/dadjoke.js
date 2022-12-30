const giveMeAJoke = require('give-me-a-joke');
const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dadjoke")
        .setDescription("Send a random dad joke"),
    async execute(interaction, client) {
        await giveMeAJoke.getRandomDadJoke(function(joke) {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(joke);

            interaction.reply({
                embeds: [embed],
            });
        })
    }
}