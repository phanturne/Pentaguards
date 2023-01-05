const Profile = require(`../../schemas/profileSchema.js`);
const Card = require(`../../schemas/cardSchema.js`);
const Frame = require(`../../schemas/frameSchema.js`);
const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const { cardDropImage } = require(`../../tcgHelper/cardDropImage.js`);
const { createClaimCardCollector } = require(`../../tcgHelper/createPickCardCollector.js`);
const { request } = require('undici');

// @TODO: Allow users to claim cards and add into their collection
module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Claim a card from 3 random options (COSTS 100 SILVER)."),
    async execute(interaction) {
        await interaction.deferReply();

        // Get the player profile. Return if the player doesn't exist.
        let player = await Profile.findOne( { id: interaction.user.id })
        if (!player) return interaction.editReply("Please set up an account by typing `/tcg`.");

        // Subtract currency from the player or return an error message if it's insufficient.
        if (player.silver < 100) {
            const haveMsg = player.silver === 0 ? "have" : "only have";
            let embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`Insufficient silver. You ${haveMsg} \`${player.silver}\` silver. `)
            return interaction.editReply({ ephemeral: true, embeds: [embed] });
        }
        await player.updateOne( { id: player.id }, { silver: player.silver - 100 });

        // Set the number of cards to be generated and claimed, based on the user's status
        const numCards = 3;
        const numClaim = 1;

        // Randomly pick cards and frames
        const cards = await Card.aggregate([{ $sample: { size: numCards } }]);
        const frames = await Frame.aggregate([{ $sample: { size: numCards } }]);

        // Create the combined image and send it in an embed
        const attachment = await cardDropImage(numCards, cards, frames);
        const claimAmountString = numClaim > 1 ? `${numClaim} cards` : `${numClaim} card`;
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Claim ${claimAmountString}`)
            .setDescription(`You may pick **${claimAmountString}**. React with the respective position emoji to claim.`)
            .setImage(`attachment://cards.png`)
            .setThumbnail(interaction.user.avatarURL())
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()});

        const message = await interaction.editReply({
            embeds: [embed],
            files: [attachment]
        });

        // Create a reaction collector that processes the actual claiming of the card
        await createClaimCardCollector(message, interaction, numCards, numClaim, cards, frames, player);

    }
}