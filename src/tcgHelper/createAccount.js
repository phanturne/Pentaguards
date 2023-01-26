const Profile = require('../schemas/profileSchema');
const Artist = require(`../schemas/artistSchema`);
const { Types } = require('mongoose');

module.exports = {
	async createProfile(interaction) {
		const date = new Date();
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		const player = await new Profile({
			_id: Types.ObjectId(),
			id: interaction.user.id,
			name: interaction.user.username,
			dateJoined: `${month}/${day}/${year}`,
		});

		await player.save().catch(console.error);
	},

	async createArtist(interaction, client, profilePic, username, aiModels, socials) {
		// If the artist does not have a profile yet, create one for them
		let artistProfile = await client.getDiscordArtist(interaction);
		if (!artistProfile) {
			artistProfile = await new Artist({
				_id: Types.ObjectId(),
				id: await Artist.countDocuments(),
			});
		}

		// Add identification info
		artistProfile.artist = username ? username : 'Anonymous';
		artistProfile.discord = interaction.user.username;
		artistProfile.discordID = interaction.user.id;

		// Add optional info
		if (profilePic) artistProfile.profilePic = profilePic;
		if (aiModels) artistProfile.aiModels = aiModels;

		// Reset social links
		artistProfile.pixiv = '';
		artistProfile.pixivFanbox = '';
		artistProfile.artStation = '';
		artistProfile.deviantArt = '';
		artistProfile.twitter = '';
		artistProfile.instagram = '';
		artistProfile.patreon = '';

		// Get the social links provided by the user
		const socialLinks = socials.split(/\s+/);

		// For each social link, check if it's a valid link.
		for (let link of socialLinks) {
			// Change links to start with "https://"
			if (!link.startsWith('https://')) link = `https://${link}`;

			if (link.includes('pixiv.net')) artistProfile.pixiv = link;
			if (link.includes('fanbox.cc')) artistProfile.pixivFanbox = link;
			if (link.includes('artstation.com')) artistProfile.artStation = link;
			if (link.includes('deviantart.com')) artistProfile.deviantArt = link;
			if (link.includes('twitter.com')) artistProfile.twitter = link;
			if (link.includes('instagram.com')) artistProfile.instagram = link;
			if (link.includes('patreon.com')) artistProfile.patreon = link;
		}

		// Save the artist profile to database and return the ID
		await artistProfile.save().catch(console.error);
		return artistProfile.id;
	},
};