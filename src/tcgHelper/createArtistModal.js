const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
module.exports = {
    async createArtistModal(interaction) {
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

        // const profilePic = new TextInputBuilder()
        //     .setCustomId(`profilePic`)
        //     .setLabel(`Profile Picture`)
        //     .setRequired(false)
        //     .setPlaceholder('Include a link to your profile picture')
        //     .setStyle(TextInputStyle.Short);

        const aiModels = new TextInputBuilder()
            .setCustomId(`aiModels`)
            .setLabel(`List AI models (separated by commas)`)
            .setRequired(false)
            .setPlaceholder('ex. Midjourney, Stable Diffusion, NovelAI, DALL-E, etc')
            .setStyle(TextInputStyle.Short);

        const socials = new TextInputBuilder()
            .setCustomId(`socials`)
            .setLabel(`List social links (one per line)`)
            .setRequired(false)
            .setPlaceholder('ex. Instagram, Twitter, Pixiv, DeviantArt, etc')
            .setStyle(TextInputStyle.Paragraph);

        const row1 = new ActionRowBuilder().addComponents(username);
        // const row2 = new ActionRowBuilder().addComponents(profilePic);
        const row3 = new ActionRowBuilder().addComponents(aiModels);
        const row4 = new ActionRowBuilder().addComponents(socials);

        // Add inputs to the modal
        modal.addComponents(row1, row3, row4);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
}