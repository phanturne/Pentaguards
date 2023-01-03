const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans the provided user.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for banning'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'Unspecified';
        const member = await interaction.guild.members
            .fetch(user.id)
            .catch(console.error);

        if (!member) return interaction.reply({
            content: "That was not a valid member.",
            ephemeral: true,
        });

        await member.user.send({
            content: `You have been banned from ${interaction.guild.name}!\nReason: ${reason}`
        }).catch(console.error);

        await member.ban({
            deleteMessageSeconds: 24 * 60 * 60,
            reason: reason,
        }).catch(console.error);

        await interaction.reply(`Banning ${user.username} for reason: ${reason}`);
    },
};