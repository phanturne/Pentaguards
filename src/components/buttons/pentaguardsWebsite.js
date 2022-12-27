module.exports = {
    data: {
        name: "pentaguardsWebsite"
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: "https://pentaguards.com"
        })
    }
}