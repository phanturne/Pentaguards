const Artist = require(`../../schemas/artistSchema.js`);
const { SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

function buildButton(label, URL) {
    return new ButtonBuilder()
        .setLabel(label)
        .setURL(URL)
        .setStyle(ButtonStyle.Link)
}

function getSocialButtons(profile) {
    const buttons = [];
    if (profile.pixiv) buttons.push(buildButton("Pixiv", profile.pixiv));
    if (profile.pixivFanbox) buttons.push(buildButton("Pixiv Fanbox", profile.pixivFanbox));
    if (profile.artStation) buttons.push(buildButton("ArtStation", profile.artStation));
    if (profile.deviantArt) buttons.push(buildButton("DeviantArt", profile.deviantArt));
    if (profile.instagram) buttons.push(buildButton("Instagram", profile.instagram));
    if (profile.twitter) buttons.push(buildButton("Twitter", profile.twitter));

    return buttons;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("artist")
        .setDescription("Display the profile card of a specific artist")
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Artist ID to search for')
                .setRequired(true)),
    async execute(interaction) {
        const artistId = interaction.options.getString("id");
        let profile = await Artist.findOne({id: artistId})

        // If it is a valid id, display the artist profile
        if (profile) {
            // Create a list of social media buttons
            const row = new ActionRowBuilder().addComponents(getSocialButtons(profile));

            let embed;
            if (profile.profilePic) {
                embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`${profile.artist}'s Profile`)
                    .setImage(profile.profilePic ? profile.profilePic : "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png")
                    .addFields([
                        {
                            name: `Artist ID`,
                            value: `#${profile.id}`,
                            inline: true,
                        },
                        {
                            name: `AI Models`,
                            value: profile.aiModels ? profile.aiModels : "Unknown",
                            inline: true,
                        }
                    ]);
            } else {
                embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`${profile.artist}'s Profile`)
                    .addFields([
                        {
                            name: `Artist ID`,
                            value: profile.id,
                            inline: true,
                        },
                        {
                            name: `AI Models`,
                            value: profile.aiModels ? profile.aiModels : "Unknown",
                            inline: true,
                        }
                    ]);
            }

            if (row.components.length > 0) {
                await interaction.reply({ embeds: [embed], components: [row] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } else {
            interaction.reply("Invalid artist ID.")
        }
    }
}
