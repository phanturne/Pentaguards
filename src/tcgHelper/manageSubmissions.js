const sharp = require('sharp');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const Jimp = require('jimp');

// module.exports = {
// 	async createCard(comboID, cardId, frameId, newWidth, newLength, lengthShift, widthShift) {
// 		const padTop = Math.ceil((540 - newLength) / 2 - lengthShift);
// 		const padBottom = Math.floor((540 - newLength) / 2 + lengthShift);
// 		const padLeft = Math.ceil((360 - newWidth) / 2 - widthShift);
// 		const padRight = Math.floor((360 - newWidth) / 2 + widthShift);
//
// 		// Calculate the file names
// 		const cardPath = `${__dirname}/../../assets/cards/${cardId}.png`;
// 		const framePath = `${__dirname}/../../assets/frames/${frameId}.png`;
// 		const filledFramePath = `${__dirname}/../../assets/filledFrames/${frameId}.png`;
//
// 		// Resize card image based on the frame's new width and height
// 		const resizedImg = await sharp(cardPath)
// 			.resize({
// 				width: newWidth,
// 				height: newLength,
// 			})
// 			.extend({
// 				// Pad the image w/ invisible pixels on all sides until its the same size as before
// 				top: padTop,
// 				bottom: padBottom,
// 				left: padLeft,
// 				right: padRight,
// 			})
// 			.toBuffer()
// 			.catch(err => {
// 				console.log('Error: ', err);
// 			});
//
// 		// Apply an overlay to get the card in the shape of the filled frame
// 		let composite = await sharp(resizedImg)
// 			.composite([{
// 				input: filledFramePath,
// 				blend: 'dest-atop',
// 			}])
// 			.toBuffer();
//
// 		// Apply an overlay to frame-shaped card to add the actual frame on top
// 		return await sharp(composite)
// 			.composite([
// 				{
// 					input: framePath,
// 				},
// 			])
// 			.toBuffer();
// 	},
// };

module.exports = {
	async createSubmission(theme, category, url) {
		// Generate an ID for the submission (increments by 1 each time)


		// Get the image artwork from the url and save it to a buffer
		const imgPath = `${__dirname}/artworkImage.png`;
		let imageBuffer;
		await axios.get(url, { responseType: 'arraybuffer' })
			.then(response => {
				fs.writeFileSync(imgPath, response.data);
				return Jimp.read(response.data);
			})
			.then(image => {
				// Get the file extension of the image URL
				const extension = path.extname(url);

				// Check the file extension and set the appropriate MIME type
				let mimeType;
				if (extension === '.png') {
					mimeType = Jimp.MIME_PNG;
				} else if (extension === '.jpeg' || extension === '.jpg') {
					mimeType = Jimp.MIME_JPEG;
				} else {
					throw new Error('Invalid image type. Only PNG and JPEG are supported.');
				}

				// Store the buffer
				image.getBuffer(mimeType, (err, buffer) => {
					imageBuffer = buffer;
				});
			})
			.catch(error => {
				console.error(error);
			});

		// Get the path of the frame, category, and card placement location
		const frameShape = `${__dirname}/Modular-Frame-Pieces/${theme}.png`;
		const categoryIcon = `${__dirname}/Modular-Frame-Pieces/${category}.png`;
		const cardPlacement = `${__dirname}/Modular-Frame-Pieces/cardPlacement.png`; // @TODO: card placement is too big

		// Resize the artwork so it fits inside the card placement area
		// @TODO: Get precise measurements after changing cardPlacement.png
		const artworkImage = await sharp(imageBuffer)
			.resize({
				width: 950,
				height: 1425,
			})
			.toBuffer();

		// Apply the frame onto the image and save the compressed webp version of the card
		const cardImage = await sharp(cardPlacement)
			.composite([
				{ input: artworkImage, gravity: 'center' },
				{ input: frameShape, gravity: 'center' },
				{ input: categoryIcon, gravity: 'northwest', left: 10, top: 10 },
			])
			.toBuffer();

		// Create the webp version of the card and upload it
		// @TODO: store to buffer and upload buffer directly instead
		await sharp(cardImage)
			.webp({ quality: 50 })
			.toFile(`${__dirname}/outputImage.webp`);

		// Create the large png version of the card nd upload it

		// Store the large jpg version of the artwork

		// Return the card ID
	},

	// Finish the create card process AFTER showing the artist their submission, so they don't need to wait as long.
	async completeSubmission() {
		// Use SharpJS to create bigJPG, bigPNG, smallWebp of the card
		const highResArt = createHighResArt(card.highResArtURL);
		const highResCard = createCard(card, 'highRes');
		const lowResCard = createCard(card, 'lowRes');

		// Store under submissions/artwork/, submissions/card/, submissions/smallCard/

		// Create a new submission doc
		// Delete the local files
	},

	// APPROVE SUBMISSIONS
	// Add a card document with the info
	// Move images from /submissions

	// REJECT SUBMISSION
	// Store in rejectedSubmissions
	// Remove from submissions
};
