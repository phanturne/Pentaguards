const { randomCardID } = require('./generateRandomID');
const sharp = require('sharp');

module.exports = {
	async createCard(card, artFile, outputFolder) {
		// Generate a unique card ID
		const randomID = await randomCardID(6);

		// Use SharpJS to create bigJPG, bigPNG, smallWebp of the card
		const highResArt = createHighResArt(card.highResArtURL);
		const highResCard = createCard(card, 'highRes');
		const lowResCard = createCard(card, 'lowRes');

		// Upload bigJPG and bigPNG to R2 Bucket

		// Update cards document with (ID, 3 URLs)
	},
};
