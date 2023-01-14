const Profile = require("../../schemas/profileSchema");
const {EmbedBuilder} = require("discord.js");

module.exports = (client) => {
    client.getProfile = async (interaction, user = interaction.user) => {
        const player = await Profile.findOne( { id: user.id })
        if (player) return player;

        const msg = (user === interaction.user) ? "Please set up an account by typing `/tcg`." : `**${user.username}** has not set up their account yet.`;
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription(msg)
        await interaction.editReply({
            embeds: [embed],
        });
    }
}