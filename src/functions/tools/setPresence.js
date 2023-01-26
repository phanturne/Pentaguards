const { ActivityType } = require('discord.js');

module.exports = (client) => {
	client.setPresence = async () => {
		await client.user
			.setPresence({
				activities: [
					{
						name: 'Pentaguards TCG',
						type: ActivityType.Playing,
					},
				],
				status: 'online',
			});
	};
};