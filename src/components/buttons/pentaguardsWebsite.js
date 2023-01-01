module.exports = {
    data: {
        name: "pentaguardsWebsite"
    },
    async execute(interaction) {
        await interaction.reply({
            content: "https://pentaguards.com"
        })
    }
}