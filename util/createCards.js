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

		// Store smallWebp under /cards

		// Update cards document with (ID, 3 URLs)
	},
};

async createCard(highRes, comboID, cardId, frameId, newWidth, newLength);
{
	// Calculate the file names
	const cardPath = `${__dirname}/../../assets/cards/${cardId}.png`;
	const framePath = `${__dirname}/../../assets/frames/${frameId}.png`;
	const filledFramePath = `${__dirname}/../../assets/filledFrames/${frameId}.png`;

	// Resize card image based on the frame's new width and height
	const resizedImg = await sharp(cardPath)
		.resize({
			width: newWidth,
			height: newLength,
		})
		.toBuffer()
		.catch(err => {
			console.log('Error: ', err);
		});

	// Apply an overlay to get the card in the shape of the filled frame
	let composite = await sharp(resizedImg)
		.composite([{
			input: filledFramePath,
			blend: 'dest-atop',
		}])
		.toBuffer();

	// Apply an overlay to frame-shaped card to add the actual frame on top
	return await sharp(composite)
		.composite([
			{
				input: framePath,
			},
		])
		.toBuffer();
}
,
