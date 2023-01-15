const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder,
        ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');
const Profile = require(`../../schemas/profileSchema.js`);
const { Types } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Get started with Pentaguards TCG'),
    async execute(interaction) {
        // Check if the player already has an account
        let player = await Profile.findOne( { id: interaction.user.id })

        // Create a button to set up an account for the player
        const button = new ButtonBuilder()
            .setCustomId("tcgStart")
            .setLabel('Start')
            .setStyle(ButtonStyle.Success)
        const row = new ActionRowBuilder().addComponents(button);

        // If the player already has an account, disable the button
         if (player) button.setDisabled(true);

        // Sound game description with a button to set up their profile
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Pentaguards TCG')
            .setDescription(
                `Are you ready to embark on an epic journey through a world of AI-generated art and 
                imagination? Click the button below to begin your adventure!

                **Core Features**
                * Collect stunning AI artworks from your favorite artists
                * Unleash your imagination and create unique decks
                * Generate captivating world synopses based on your cards
                *  Showcase your own creativity by submitting your art and see it come to life in the game.
                * Connect with other players through exciting features, such as trading, guilds, treasure chests, gift bombs, and more!
                * Completely free to play, with optional donations to support artist collaborations, community contests, and the game development.
                `);

        const message = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        if (!player) {
            // Create a message collector
            const collector = await message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                max: 1,
            });

            // Send next message if user accepts TOS. Cancel submission process if they reject.
            collector.on("collect", async () => {
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
                await interaction.followUp({
                    content: `${player.name}, you have successfully set up an account. Enjoy your adventure!`,
                    ephemeral: true,
                })
            })
        }
    },
};