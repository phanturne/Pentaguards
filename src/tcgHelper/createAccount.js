const Profile = require('../schemas/profileSchema');
const Artist = require(`../schemas/artistSchema`);
const {Types} = require("mongoose");

module.exports = {
    async createProfile (interaction) {
        const date = new Date()
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const player = await new Profile({
            _id: Types.ObjectId(),
            id: interaction.user.id,
            name: interaction.user.username,
            dateJoined: `${month}/${day}/${year}`,
        })

        await player.save().catch(console.error);
    },

    async createArtist (interaction, client, username = "Anonymous", aiModels, socials) {
        // If the artist does not have a profile yet, create one for them
        let artist = await client.getDiscordArtist(interaction);
        if (!artist) {
            artist = await new Artist({
                _id: Types.ObjectId(),
                id: Artist.count(),
            })
        }

        artist.name = username;
        artist.discord = interaction.user.username;
        artist.discordID = interaction.user.id;

        await artist.save().catch(console.error);

        return artist.id;
    }
}