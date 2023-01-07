const UniqueID = require(`../schemas/uniqueIDSchema.js`);
const Card = require(`../schemas/cardSchema.js`);
const mongoose = require("mongoose");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    async createClaimCardCollector(message, interaction, numCards, numClaim, cards, frames, player) {
        // Array of valid "selection" emojis
        const validEmojis = new Map([['1️⃣', 0], ['2️⃣', 1], ['3️⃣', 2], ['4️⃣', 3], ['5️⃣', 4]]);

        // Create an emoji collector to collect the user's choice
        let playerChoice;
        const filter = (reaction, user) => {
            playerChoice = reaction.emoji.name;
            return validEmojis.has(reaction.emoji.name) && user.id === interaction.user.id;
        };

        // React to the message with the "selection" emojis
        let i = 0;
        for (let emoji of validEmojis.keys()) {
            await message.react(emoji);
            if (++i === numCards) break;
        }

        // Update each card's drop count
        for (const card of cards) {
            await Card.updateOne( { id: card.id }, { dropCount: card.dropCount + 1})
        }

        // Create a reaction collector with a 5-minute time limit
        const collector = message.createReactionCollector({ filter, max: numClaim, time: 300000});
        await collector.on('collect', (reaction, user) => {
            const choice = validEmojis.get(playerChoice);
            const card = cards[choice];
            const newID = `${card.id}${card.claimCount + 1}`;
            const frame = frames[choice];

            // Add the card to the user's profile
            player.cardsList.push(newID);
            player.save().catch(console.error);

            // Add the card to the unique IDs database
            const uniqueCard = new UniqueID({
                _id: mongoose.Types.ObjectId(),
                id: newID,
                cardID: card.id,
                printNumber: card.claimCount + 1,
                ownerID: player.id,
                ownerName: player.name,
                condition: "N/A",
                frameID: frame.id,
            })
            uniqueCard.save().catch(console.error);

            // Update the card's claim count
            Card.updateOne( { id: card.id }, { claimCount: card.claimCount + 1}).exec();

            // Include buttons to show card and artist info
            const cardButton = new ButtonBuilder()
                .setCustomId(`showCardButton${newID}`)
                .setLabel("Card Info")
                .setStyle(ButtonStyle.Primary)

            const artistButton = new ButtonBuilder()
                .setCustomId(`showArtistButton${card.artistID}`)
                .setLabel("Artist Info")
                .setStyle(ButtonStyle.Primary)

            interaction.followUp({
                content: `${interaction.user.username} has claimed card: \`#${newID}\``,
                components: [new ActionRowBuilder().addComponents(cardButton, artistButton)],
            });
        })

        collector.on('end', collected => {
            if (collected.size === 0) interaction.followUp({
                ephemeral: true,
                content: "No cards have been claimed!",
            })
        });
    }
}