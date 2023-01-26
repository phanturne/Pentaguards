const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

// @TODO: command does not work
module.exports = {
	data: new SlashCommandBuilder()
		.setName('urban')
		.setDescription('Get the urban dictionary definition of a word.'),
	async execute(interaction, client) {
		await interaction.deferReply();

		const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });

		const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
		const { list } = await dictResult.body.json();

		if (!list.length) {
			return interaction.editReply(`No results found for **${term}**.`);
		}

		const [answer] = list;

		const embed = new EmbedBuilder()
			.setColor(0xEFFF00)
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{
					name: 'Rating',
					value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
				},
			);
		await interaction.editReply({ embeds: [embed] });
	},
};

