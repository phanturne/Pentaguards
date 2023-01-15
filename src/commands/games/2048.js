// Source: https://discord-gamecord.js.org/docs/gamecord/master/games/2048

const { SlashCommandBuilder } = require("discord.js");
const { TwoZeroFourEight } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('2048')
        .setDescription('Start a game of 2048'),
    async execute(interaction) {
        const Game = new TwoZeroFourEight({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: '2048',
                color: '#5865F2'
            },
            emojis: {
                up: '⬆️',
                down: '⬇️',
                left: '⬅️',
                right: '➡️',
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
    },
};