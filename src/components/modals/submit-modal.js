module.exports = {
    data: {
        name: 'submit-modal',
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `You said your favorite color is ${interaction.fields.getTextInputValue("cardName")}`,
        });
    }
}