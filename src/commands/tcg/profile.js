const { SlashCommandBuilder } = require('discord.js');
const Profile = require(`../../schemas/profileSchema.js`);
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Display the user\'s profile.')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
    async execute(interaction, client) {
        let player = await Profile.findOne( { id: interaction.user.id })
        // @TODO: If the profile does not exist, display error message. Else, display the profile
        await interaction.reply({
            content: `${interaction.targetUser.displayAvatarURL()}`
        })
    },
};