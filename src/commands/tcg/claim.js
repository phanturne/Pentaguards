const Card = require(`../../schemas/cardSchema.js`);
const Frame = require(`../../schemas/frameSchema.js`);
const Profile = require(`../../schemas/profileSchema.js`);
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCard, combineCards } = require(`../../tcgHelper/createCard.js`);
const { request } = require('undici');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');

// @TODO: Allow users to claim cards and add into their collection
module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Claim a card from 3 random options."),
    async execute(interaction) {
        await interaction.deferReply();

        // Get the player
        let player = await Profile.findOne( { id: interaction.user.id })

        if (!player) return interaction.editReply("Please set up an account by typing `/tcg`.");

        // @TODO: move card generation to tcgHelper
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

        const message = await interaction.editReply({
            embeds: [embed],
            files: [attachment]
        });

        // React to the message with the "selection" emojis
        const validEmojis = new Map([['1️⃣', 0], ['2️⃣', 1], ['3️⃣', 2]]);
        for (let emoji of validEmojis.keys()) {
            await message.react(emoji);
        }
        let playerChoice;

        // Create an emoji collector to collect the user's choice
        const filter = (reaction, user) => {
            playerChoice = reaction;
            return validEmojis.includes(reaction.emoji.name) && user.id === interaction.user.id;
        };

        // Update the card's drop count
        for (let card of cards) {
            card.dropCount += 1;
            card.save().catch(console.error);
        }

        const collector = message.createReactionCollector({ filter, max: 1, time: 15000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            // Add the card to the user's profile
            const card = cards[validEmojis[playerChoice]]
            player.cardsList.push(card.id + card.printNumber);
            player.save().catch(console.error);

            // Update card's print total
            card.claimCount += 1;
            card.save().catch(console.error);

            interaction.followUp("You have successfully claimed a card.")
        });

        // collector.on('end', collected => {
        //     // console.log(`Collected ${collected.size} items`);
        //     interaction.followUp("You have successfully claimed a card.") //@TODO: include card info
        // });
    }
}