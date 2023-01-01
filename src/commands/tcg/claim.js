const Card = require(`../../schemas/cardSchema.js`);
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// @TODO: Allow users to claim cards and add into their collection
module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Claim a card from 3 random options."),
    async execute(interaction) {
        await interaction.deferReply();

        // Randomly pick 3 cards and store the image URLs
        const cards = await Card.aggregate([{ $sample: { size: 3 } }]);
        let imageURLs = [];
        for (const i in cards) {
            imageURLs.push(cards[i].url);
        }

        // Apply frames onto the 3 cards

        // Combine the 3 cards into 1 big image
        const finalImage = imageURLs[0];

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Claim a Card')
            .setDescription(`You may choose 1 card. React with the respective emoji to claim it`)
            .setImage(finalImage)
            .setThumbnail(interaction.user.avatarURL())
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()});

        await interaction.editReply({
            embeds: [embed],
        });
    }
}