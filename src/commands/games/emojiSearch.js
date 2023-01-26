// https://discord-gamecord.js.org/docs/gamecord/master/games/FindEmoji

const { SlashCommandBuilder } = require('discord.js');
const { FindEmoji } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojisearch')
		.setDescription('Start an emoji search game.'),
	async execute(interaction) {
		const Game = new FindEmoji({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: 'Find Emoji',
				color: '#5865F2',
				description: 'Remember the emojis from the board below.',
				findDescription: 'Find the {emoji} emoji before the time runs out.',
			},
			timeoutTime: 60000,
			hideEmojiTime: 5000,
			buttonStyle: 'SECONDARY',
			emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
			winMessage: 'You won! You selected the correct emoji. {emoji}',
			loseMessage: 'You lost! You selected the wrong emoji. {emoji}',
			timeoutMessage: 'You lost! You ran out of time. The emoji is {emoji}',
			playerOnlyMessage: 'Only {player} can use these buttons.',
		});

		Game.startGame();
	},
};