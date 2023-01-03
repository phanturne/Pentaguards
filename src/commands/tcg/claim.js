const Card = require(`../../schemas/cardSchema.js`);
const Frame = require(`../../schemas/frameSchema.js`);
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCard, combineCards } = require(`../../tcgHelper/createCard.js`);
const { request } = require('undici');
const { readFile } = require('fs/promises');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');

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
            // newCards.push(new AttachmentBuilder(
            //     await createCard(
            //         cards[i].id + borders[i].id,
            //         cards[i].id,
            //         borders[i].id,
            //         Math.round(borders[i].cardRatio * 360 * borders[i].finalRatio),
            //         Math.round(borders[i].cardRatio * 540 * borders[i].finalRatio),
            //         borders[i].lengthShift,
            //         borders[i].widthShift,
            //     ),
            //     {name: `card${i}.png`}
            // ));
            newCards.push(await createCard(
                cards[i].id + borders[i].id,
                cards[i].id,
                borders[i].id,
                Math.round(borders[i].cardRatio * 360 * borders[i].finalRatio),
                Math.round(borders[i].cardRatio * 540 * borders[i].finalRatio),
                borders[i].lengthShift,
                borders[i].widthShift,
            ))
        }

        // Create a pixel canvas and get its context, which will be used to modify the canvas
        const canvas = createCanvas(1200, 540);
        const context = canvas.getContext('2d');

        // This uses the canvas dimensions to stretch the image onto the entire canvas
        const background = await loadImage("https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png")
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Add the cards onto the main canvas
        for (let i = 0; i < 3; i++) {
            const cardBuffer = await loadImage(newCards[i]);
            context.drawImage(cardBuffer, 400 * i, 0, 360, 540);
        }

        // Use the helpful Attachment class structure to process the file for you
        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'cards.png' });

        // const attachment = new AttachmentBuilder(await combineCards(newCards), { name: 'cards.png'});

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