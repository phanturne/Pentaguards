const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("artistprofile")
        .setDescription("Update your artist profile.")
        .addAttachmentOption(option =>
            option
                .setName('image')
                .setDescription('Image to use for your profile picture')
                .setRequired(false)),
    async execute(interaction, client) {
        // Create modal for artist profile
        const modal = new ModalBuilder()
            .setCustomId(`setup-artist-profile`)
            .setTitle(`Set Up Artist Profile`);

        const username = new TextInputBuilder()
            .setCustomId(`username`)
            .setLabel(`Username`)
            .setRequired(false)
            .setPlaceholder('Leave this blank to stay anonymous')
            .setStyle(TextInputStyle.Short);

        const aiModels = new TextInputBuilder()
            .setCustomId(`aiModels`)
            .setLabel(`List AI models (separated by commas)`)
            .setRequired(false)
            .setPlaceholder('ex. Midjourney, Stable Diffusion, NovelAI, DALLE-2')
            .setStyle(TextInputStyle.Short);

        const socials = new TextInputBuilder()
            .setCustomId(`socials`)
            .setLabel(`List social links (one per line)`)
            .setRequired(false)
            .setPlaceholder('ex. Instagram, Twitter, Pixiv, ArtStation, DeviantArt, Pixiv FanBox, Patreon')
            .setStyle(TextInputStyle.Paragraph);

        const row1 = new ActionRowBuilder().addComponents(username);
        const row2 = new ActionRowBuilder().addComponents(aiModels);
        const row3 = new ActionRowBuilder().addComponents(socials);

        // Add inputs to the modal
        modal.addComponents(row1, row2, row3);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
}


