const Card = require(`../../schemas/cardSchema.js`);
const Frame = require(`../../schemas/frameSchema.js`);
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createCard, combineCards } = require(`../../tcgHelper/createCard.js`);

// @TODO: Allow users to claim cards and add into their collection
module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Claim a card from 3 random options."),
    async execute(interaction) {
        await interaction.deferReply();

        // Randomly pick 3 cards and 3 borders
        const cards = await Card.aggregate([{ $sample: { size: 3 } }]);
        const borders = await Frame.aggregate([{ $sample: { size: 3 } }]);

        // Apply frames onto the 3 cards
        const newCards = []
        for (let i = 0; i < 3; i++) {
            newCards.push(
                createCard(cards[i].id + borders[i].id,
                    cards[i].url,
                    borders[i].filledURL,
                    borders[i].url,
                    borders[i].newWidth,
                    borders[i].newLength
            ));
        }

        // Combine the 3 cards into 1 big image
        // const finalImage = combineCards(newCards);
        const finalImage = newCards[0];

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