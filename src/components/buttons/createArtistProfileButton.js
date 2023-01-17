const {createArtistModal} = require("../../tcgHelper/createArtistModal");

module.exports = {
    data: {
        name: "createArtistProfileButton"
    },
    async execute(interaction) {
        await createArtistModal(interaction);
    }
}