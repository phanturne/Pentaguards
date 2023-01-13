const { SlashCommandBuilder } = require('discord.js');
const Profile = require(`../../schemas/profileSchema.js`);
const { Types } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tcg')
        .setDescription('Display the user\'s profile.')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
    async execute(interaction) {
        let player = await Profile.findOne( { id: interaction.user.id })
        // @TODO: Respond with a button that sets up the player profile
        if (!player) {
            const date = new Date()
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            player = await new Profile({
                _id: Types.ObjectId(),
                id: interaction.user.id,
                name: interaction.user.username,
                dateJoined: `${month}/${day}/${year}`,
                guild: "N/A",
                wishlist: [],
                cardsList: [],
            })

            await player.save().catch(console.error);
            await interaction.reply({
                content: `Successfully set up profile for ${player.name}.`,
            })
        } else {
            interaction.reply(`You already have a profile. Set up on ${player.dateJoined}`);
        }
    },
};