const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const Card = require(`../schemas/cardSchema.js`);
const Frame = require(`../schemas/frameSchema.js`);
const Artist = require(`../schemas/artistSchema.js`);
const UniqueID = require(`../schemas/uniqueIDSchema.js`);
const {cardDropImage} = require("./cardDropImage");

module.exports = {
    async showCard(interaction, cardId) {
        // Find the card info from the database.
        const card = await UniqueID.findOne({ id: cardId });
        if (!card) return;

        const cardInfo = await Card.findOne( { id: card.cardID });
        const frameInfo = await Frame.findOne( { id: card.frameID });
        const attachment = await cardDropImage(1, [cardInfo], [frameInfo])
        const collection = card.group;
        const aiModel = card.aiModel;
        const fullArt = card.fullArt ? `[Source](${card.fullArt})` : "N/A";

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(cardInfo.name)
            .setImage(`attachment://cards.png`)
            .addFields([
                { name: `Unique ID        \u200B`, value: `#${card.id}`           , inline: true, },
                { name: `Card ID          \u200B`, value: `#${card.cardID}`       , inline: true, },
                { name: `Print Number`           , value: `#${card.printNumber}`  , inline: true, },
                { name: `Owner`                  , value: card.ownerName          , inline: true, },
                { name: `Condition   \u200B`     , value: card.condition          , inline: true, },
                { name: `Frame`                  , value: frameInfo.name          , inline: true, },
                { name: `Date Added      \u200B`, value: card.dateAdded , inline: true, },
                { name: `Card ID         \u200B`, value: `#${card.id}`  , inline: true, },
                { name: `Rarity`                , value: card.rarity    , inline: true, },
                { name: `Style   \u200B`        , value: card.style     , inline: true, },
                { name: `Category`              , value: card.category  , inline: true, },
                { name: `Collection`            , value: collection     , inline: true, },
                { name: `Artist`                , value: card.artist    , inline: true, },
                { name: `AI Model        \u200B`, value: aiModel        , inline: true, },
                { name: `Full Art`              , value: fullArt        , inline: true, },
            ]);

        await interaction.reply({
            embeds: [embed],
            files: [attachment] });

        // Reply with the card embed if the ID is valid. Otherwise, reply with an error message
        if (card) {
        } else {
            await interaction.reply({
                ephemeral: true,
                content: "Invalid card ID.",
            })
        }
    },

    async showArtist(interaction, artistId) {
        let artist = await Artist.findOne({id: artistId})

        // If it is a valid id, display the artist artist
        if (artist) {
            // Create a list of social media buttons
            const row = new ActionRowBuilder().addComponents(getSocialButtons(artist));

            let embed;
            embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${artist.artist}'s Profile`)
                .setThumbnail(artist.profilePic ? artist.profilePic : "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png")
                .addFields([
                    {
                        name: `Artist ID`,
                        value: `#${artist.id}`,
                        inline: true,
                    },
                    {
                        name: `AI Models`,
                        value: artist.aiModels ? artist.aiModels : "Unknown",
                        inline: true,
                    }
                ]);

            if (row.components.length > 0) {
                await interaction.reply({
                    // ephemeral: true,
                    embeds: [embed],
                    components: [row]});
            } else {
                await interaction.reply({
                    // ephemeral:true,
                    embeds: [embed] });
            }
        } else {
            await interaction.reply({
                ephemeral: true,
                content: "Invalid artist ID.",
            })
        }
    }
}

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
    if (profile.patreon) buttons.push(buildButton("Patreon", profile.patreon));
    if (profile.xiaohongshu) buttons.push(buildButton("小红书", profile.xiaohongshu));

    return buttons;
}