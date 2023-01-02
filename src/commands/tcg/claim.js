const Card = require(`../../schemas/cardSchema.js`);
const Frame = require(`../../schemas/frameSchema.js`);
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCard, combineCards } = require(`../../tcgHelper/createCard.js`);
// const { request } = require('undici');
// const { readFile } = require('fs/promises');
// const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');
// const joinImages = require('join-images');

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
            newCards.push(new AttachmentBuilder(
                await createCard(
                    cards[i].id + borders[i].id,
                    cards[i].id,
                    borders[i].id,
                    300,
                    450,
                    borders[i].lengthShift,
                    borders[i].widthShift,
                ),
                {name: `card${i}.png`}
            ));
        }

        const attachment = new AttachmentBuilder(await combineCards(newCards), { name: 'cards.png'});

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Claim a Card')
            .setDescription(`You may choose 1 card. React with the respective emoji to claim it`)
            .setImage(`attachment://cards.png`)
            .setThumbnail(interaction.user.avatarURL())
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()});

        await interaction.editReply({
            embeds: [embed],
            files: [attachment]
        });
    }
}