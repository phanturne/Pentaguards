const { SlashCommandBuilder } = require("discord.js");
const { showCard } = require("../../tcgHelper/showInfo");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("card")
        .setDescription("Display a card and its stats. ")
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Enter a 6 character card id')
                .setRequired(true)),
    async execute(interaction) {
        const cardId = interaction.options.getString("id");
        await showCard(interaction, cardId);
    }
}
