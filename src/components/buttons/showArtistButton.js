const { showArtist } = require("../../tcgHelper/showInfo");

module.exports = {
    data: {
        name: "showArtistButton"
    },
    async execute(interaction) {
        // Card ID is appended to the end of the button's custom ID
        const idLen = "showArtistButton".length;
        await showArtist(interaction, interaction.customId.substring(idLen));
    }
}