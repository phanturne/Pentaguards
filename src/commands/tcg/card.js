const Card = require(`../../schemas/cardSchema.js`);
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// @TODO: Implement unique card copy support and card statistics
module.exports = {
    data: new SlashCommandBuilder()
        .setName("card")
        .setDescription("Display a card and its stats. ")
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Enter a card ID or a the unique ID of a specific copy of the card.')
                .setRequired(true)),
    async execute(interaction) {
        const cardId = interaction.options.getString("id");
        let card = await Card.findOne({id: cardId});

        // Create the card embed if it exists. Otherwise reply with an error message
        if (card) {
            let embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(card.name)
                .setImage(card.url)
                .addFields([
                    {
                        name: `Date Added      \u200B`,
                        value: card.dateAdded,
                        inline: true,
                    },
                    {
                        name: `Card ID`,
                        value: `#${card.id}`,
                        inline: true,
                    },
                    {
                        name: `Rarity`,
                        value: card.rarity,
                        inline: true,
                    },
                    {
                        name: `Style   \u200B`,
                        value: card.style,
                        inline: true,
                    },
                    {
                        name: `Category`,
                        value: card.category,
                        inline: true,
                    },
                    {
                        name: `Collection`,
                        value: card.group ? card.group : "N/A",
                        inline: true,
                    },
                    {
                        name: `Artist`,
                        value: `${card.artist}`,
                        inline: true,
                    },
                    {
                        name: `AI Model         \u200B`,
                        value: card.aiModel ? `${card.aiModel}` : "Unknown",
                        inline: true,
                    },
                    {
                        name: `Full Art`,
                        value: card.fullArt ? `[Source](${card.fullArt})` : "N/A",
                        inline: true,
                    }
                ]);

            await interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply("Invalid card ID.")
        }
    }
}
