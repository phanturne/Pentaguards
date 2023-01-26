const { SlashCommandBuilder } = require('discord.js');
const Profile = require(`../../schemas/profileSchema.js`);
const ms = require('ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Claim rewards for upvoting the bot!'),
	async execute(interaction, client) {
		// Get the player profile. Return if the player doesn't exist.
		let player = await Profile.findOne({ id: interaction.user.id });
		if (!player) return interaction.editReply('Please set up an account by typing `/tcg`.');

		// Source: https://stackoverflow.com/questions/48432102/discord-js-cooldown-for-a-command-for-each-user-not-all-users
		const cooldown = 43200000; // 12 hours in ms
		const lastDaily = await client.db.get(`vote_${interaction.user.id}`);
		const timeRemaining = cooldown - (Date.now() - lastDaily);
		const rewardAmount = 200;

		if (lastDaily !== null && timeRemaining > 0) {
			// If user still has a cooldown
			let timeObj = ms(timeRemaining); // timeObj.hours = 12
			interaction.reply({ content: `Please wait \`${timeObj}\` for the cooldown to end`, ephemeral: true });
		}
		else {
			// Otherwise give them their daily and update the cooldown
			await Profile.updateOne({ id: player.id }, { silver: player.silver + rewardAmount });
			await client.db.set(`vote_${interaction.user.id}`, Date.now());
			await interaction.reply({
				ephemeral: true,
				content: `You have claimed \`${rewardAmount}\` silver! Come back in \`${ms(cooldown)}\` to vote again.`,
			});
		}
	},
};


