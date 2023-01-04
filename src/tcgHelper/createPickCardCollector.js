const UniqueID = require(`../schemas/uniqueIDSchema.js`);
const Card = require(`../schemas/cardSchema.js`);
const mongoose = require("mongoose");

module.exports = {
    async createClaimCardCollector(message, interaction, numCards, numClaim, cards, borders, player) {
        // React to the message with the "selection" emojis
        const validEmojis = new Map([['1️⃣', 0], ['2️⃣', 1], ['3️⃣', 2], ['4️⃣', 3], ['5️⃣', 4]]);
        let i = 0;
        for (let emoji of validEmojis.keys()) {
            await message.react(emoji);
            if (++i === numCards) break;
        }

        // Create an emoji collector to collect the user's choice
        let playerChoice;
        const filter = (reaction, user) => {
            playerChoice = reaction.emoji.name;
            return validEmojis.has(reaction.emoji.name) && user.id === interaction.user.id;
        };

        // Update each card's drop count
        for (const card of cards) {
            await Card.updateOne( { id: card.id }, { dropCount: card.dropCount + 1})
        }

        const collector = message.createReactionCollector({ filter, max: numClaim, time: 1000 * 60 * 5});
        await collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            const choice = validEmojis.get(playerChoice);
            const card = cards[choice];
            const newID = `${card.id}${card.claimCount + 1}`;
            const border = borders[choice];

            // Add the card to the user's profile
            player.cardsList.push(newID);
            player.save().catch(console.error);

            // Add the card to the unique IDs database
            const uniqueCard = new UniqueID({
                _id: mongoose.Types.ObjectId(),
                id: newID,
                cardID: card.id,
                claimCount: card.claimCount + 1,
                condition: "N/A",
                frame: border.name,
            })
            uniqueCard.save().catch(console.error);

            // Update the card's claim count
            Card.updateOne( { id: card.id }, { claimCount: card.claimCount + 1}).exec();

            // @TODO: Include button to show card info
            interaction.followUp({
                ephemeral: true,
                content: `You have successfully claimed \`Card #${newID}\``,
            });
        })

        collector.on('end', collected => {
            if (collected.size == 0) interaction.followUp("No cards have been claimed!")
        });
    }
}