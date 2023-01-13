const UniqueID = require(`../schemas/uniqueIDSchema.js`);
const Card = require(`../schemas/cardSchema.js`);
const { cardDropImage } = require("./cardDropImage");
const { Types } = require("mongoose");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder} = require("discord.js");

module.exports = {
    async createClaimCardCollector(interaction, numCards, numClaim, cards, frames, player) {
        // Array of valid "selection" emojis
        const buttons = new Map([
            ["card1", 0],
            ["card2", 1],
            ["card3", 2],
            ["card4", 3],
            ["card5", 4],
        ]);

        // Add buttons for card selections
        let i = 0;
        const row = new ActionRowBuilder();
        for (let [id, label] of buttons) {
            row.addComponents(new ButtonBuilder().setCustomId(id).setLabel(`${label}`).setStyle(ButtonStyle.Primary));
            if (++i === numCards) break;
        }

        // Create the combined image and send it in an embed
        const attachment = await cardDropImage(numCards, cards, frames);
        const claimAmountString = numClaim > 1 ? `${numClaim} cards` : `${numClaim} card`;
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Claim ${claimAmountString}`)
            .setDescription(`You may pick **${claimAmountString}**. Click the button with its respective position to claim.`)
            .setImage(`attachment://cards.png`)
            .setThumbnail(interaction.user.avatarURL())
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()});

        const message = await interaction.editReply({
            embeds: [embed],
            files: [attachment],
            components: [row]
        });

        // Update each card's drop count
        for (const card of cards) {
            await Card.updateOne( { id: card.id }, { dropCount: card.dropCount + 1})
        }

        // Create a reaction collector with a 5-minute time limit
        const filter = (click) => {
            return click.user.id === interaction.user.id; };
        const collector = message.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 300000});

        await collector.on('collect', async (i) => {
            await i.deferUpdate();

            // Disable the buttons
            for (const button of row.components) button.setDisabled(true);
            await interaction.editReply({
                embeds: [embed],
                files: [attachment],
                components: [row]
            });

            // Process the player's choice
            const choice = buttons.get(i.customId);
            const card = cards[choice];
            const newID = `${card.id}${card.claimCount + 1}`;
            const frame = frames[choice];

            // Add the card to the user's profile
            player.cardsList.push(newID);
            player.save().catch(console.error);

            // Add the card to the unique IDs database
            const uniqueCard = new UniqueID({
                _id: Types.ObjectId(),
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
            await Card.updateOne({id: card.id}, {claimCount: card.claimCount + 1});

            // Include buttons to show card and artist info
            const cardButton = new ButtonBuilder()
                .setCustomId(`showCardButton${newID}`)
                .setLabel("Card Info")
                .setStyle(ButtonStyle.Primary)

            const artistButton = new ButtonBuilder()
                .setCustomId(`showArtistButton${card.artistID}`)
                .setLabel("Artist Info")
                .setStyle(ButtonStyle.Primary)

            await interaction.followUp({
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