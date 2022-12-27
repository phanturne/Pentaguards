const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('Search discordjs.guide!')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Phrase to search for')
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('version')
                .setDescription('Version to use')
                .setAutocomplete(true)),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('primary')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Primary),
            );

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Pentaguards TCG Guide')
            .setURL('https://discord.js.org')
            .setDescription('Some description here');

        await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
    },
    // async autocomplete(interaction) {
    //     const focusedOption = interaction.options.getFocused(true);
    //     let choices;
    //
    //     if (focusedOption.name === 'query') {
    //         choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
    //     }
    //
    //     if (focusedOption.name === 'version') {
    //         choices = ['v9', 'v11', 'v12', 'v13', 'v14'];
    //     }
    //
    //     const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
    //     await interaction.respond(
    //         filtered.map(choice => ({ name: choice, value: choice })),
    //     );
    // },
};