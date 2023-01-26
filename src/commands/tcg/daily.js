const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Profile = require(`../../schemas/profileSchema.js`);
const ms = require('ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim your dailies!'),
	async execute(interaction, client) {
		// Get the player profile. Return if the player doesn't exist.
		let player = await Profile.findOne({ id: interaction.user.id });
		if (!player) {
			return interaction.editReply({
				ephemeral: true,
				content: 'Please set up an account by typing `/tcg`.',
			});
		}

		// Source: https://stackoverflow.com/questions/48432102/discord-js-cooldown-for-a-command-for-each-user-not-all-users
		const cooldown = 43200000; // 12 hours in ms
		const lastDaily = await client.db.get(`daily_${interaction.user.id}`);
		const timeRemaining = cooldown - (Date.now() - lastDaily);
		const rewardAmount = 200;

		if (lastDaily !== null && timeRemaining > 0) {
			// If user still has a cooldown
			let timeObj = ms(timeRemaining); // timeObj.hours = 12
			let embed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setDescription(`Please wait **${timeObj}** for the cooldown to end.`);
			interaction.reply({
				ephemeral: true,
				embeds: [embed],
			});
		}
		else {
			// Otherwise give them their daily and update the cooldown
			await Profile.updateOne({ id: player.id }, { silver: player.silver + rewardAmount });
			await client.db.set(`daily_${interaction.user.id}`, Date.now());
			let embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setDescription(`You have claimed **${rewardAmount} silver**! Come back in **${ms(cooldown)}** to claim again.`);

			await interaction.reply({
				ephemeral: true,
				embeds: [embed],
			});
		}
	}
}


