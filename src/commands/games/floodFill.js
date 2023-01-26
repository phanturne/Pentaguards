// Source: https://discord-gamecord.js.org/docs/gamecord/master/games/Flood

const { SlashCommandBuilder } = require('discord.js');
const { Flood: FloodFill } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('floodfill')
		.setDescription('Starting from the top left, flood the grid until it turns into one color.')
		.addStringOption(option =>
			option.setName('difficulty')
				.setDescription('Choose game difficulty.')
				.setRequired(true)
				.addChoices(
					{ name: 'Easy', value: '8' },
					{ name: 'Normal', value: '13' },
				)),
	async execute(interaction) {
		const Game = new FloodFill({
			message: interaction,
			isSlashGame: false,
			embed: {
				title: 'Flood Fill',
				color: '#5865F2',
			},
			difficulty: parseInt(interaction.options.getString('difficulty')),
			timeoutTime: 60000,
			buttonStyle: 'SECONDARYY',
			emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
			winMessage: 'You won! You took **{turns}** turns.',
			loseMessage: 'You lost! You took **{turns}** turns.',
			playerOnlyMessage: 'Only {player} can use these buttons.',
		});

		Game.startGame();
	},
};