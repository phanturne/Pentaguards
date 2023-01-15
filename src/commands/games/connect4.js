// Source: https://discord-gamecord.js.org/docs/gamecord/master/games/Connect4

const { SlashCommandBuilder} = require("discord.js");
const { Connect4 } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('connect4')
        .setDescription('Start a game of Connect 4 with your friend.')
        .addUserOption(option => option
            .setName('player2')
            .setDescription('The player you want to challenge.')
            .setRequired(true)),
    async execute(interaction) {
        const Game = new Connect4({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('player2'),
            embed: {
                title: 'Connect 4 Game',
                statusTitle: 'Status',
                color: '#5865F2'
            },
            emojis: {
                board: '⚪',
                player1: '🔴',
                player2: '🟡'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            turnMessage: `{emoji} | It's **{player}**'s turn.`,
            winMessage: '{emoji} | **{player}** won the Connect 4 Game.',
            tieMessage: 'The game tied!',
            timeoutMessage: 'The game went unfinished! No one won the game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
        });

        Game.startGame();
    },
};