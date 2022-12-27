const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Prune up to 1000 messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to prune'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 1000) {
            return interaction.reply({ content: 'You need to input a number between 1 and 1000.', ephemeral: true });
        }
        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
        });

        return interaction.reply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
    },
};