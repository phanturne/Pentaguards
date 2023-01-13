const Profile = require(`../../schemas/profileSchema.js`);
const Card = require(`../../schemas/cardSchema.js`);
const Frame = require(`../../schemas/frameSchema.js`);
const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const { createClaimCardCollector } = require(`../../tcgHelper/createPickCardCollector.js`);

// @TODO: Allow users to claim cards and add into their collection
module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Claim a card from 3 random options (Costs 100 silver)."),
    async execute(interaction) {
        await interaction.deferReply();

        let player = await Profile.findOne( { id: interaction.user.id })
        if (!player) return interaction.editReply({
            ephemeral: true,
            content: "Please set up an account by typing `/tcg`.",
        });

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

        // Create a reaction collector that processes the actual claiming of the card
        await createClaimCardCollector(interaction, numCards, numClaim, cards, frames, player);
    }
}