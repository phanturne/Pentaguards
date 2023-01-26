const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Search discordjs.guide!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Phrase to search for')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('version')
				.setDescription('Version to use')
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);

		let choices;
		if (focusedOption.name === 'query') {
			choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		}
		else if (focusedOption.name === 'version') {
			choices = ['v9', 'v11', 'v12', 'v13', 'v14'];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction, client) {
		const option = interaction.options.getString('query');

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('pentaguardsWebsite')
				.setLabel('Full Guide')
				// .setURL('https://pentaguards.com')
				.setStyle(ButtonStyle.Primary),
		);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Pentaguards TCG Guide')
			.setURL('https://discord.js.org')
			.setImage(client.user.displayAvatarURL())
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription('Some description here')
			.addFields([
				{
					name: `Field 1`,
					value: 'Value 1',
					inline: true,
				},
				{
					name: `Field 2`,
					value: `Value 2`,
					inline: true,
				},
			]);

		const menu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('guide-menu')
				.setMinValues(1)
				.setMaxValues(1)
				.setOptions(new StringSelectMenuOptionBuilder({
					label: `Option 1`,
					value: `google.com`,
				}), new StringSelectMenuOptionBuilder({
					label: `Option 2`,
					value: `google.com2`,
				})),
		);

		await interaction.reply({
			ephemeral: true,
			embeds: [embed],
			components: [row, menu],
		});
	},
};