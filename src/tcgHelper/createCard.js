const sharp = require('sharp');
const fs = require('fs');
const https = require('https');
let request = require(`request`);
const axios = require('axios');

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
	async createCard(theme, category, url) {
		// Save the artwork locally
		const path = `${__dirname}/artworkImage.png`;
		await axios.get(url, { responseType: 'arraybuffer' })
			.then(response => {
				fs.writeFileSync(path, response.data);
				console.log(`Image saved to ${path}`);
			})
			.catch(error => {
				console.error(error);
			});

		// Get the path of the frame, category, and card placement location
		const frameShape = `${__dirname}/Modular-Frame-Pieces/${theme}.png`;
		const categoryIcon = `${__dirname}/Modular-Frame-Pieces/${category}.png`;
		const cardPlacement = `${__dirname}/Modular-Frame-Pieces/Fantasai.png`; // Fantasai is used as cardPlacement b/c its the smallest

		// Resize the artwork so it fits inside the card placement area
		// @TODO: Current size is hardcoded to fit the fantasai frame, which will lead to slightly larger frame width for the other frames
		const artworkImage = await sharp(path)
			.resize({
				width: 950,
				height: 1425,
			})
			.toBuffer();

		// Apply the frame onto the image and save it
		await sharp(cardPlacement)
			.composite([
				{ input: artworkImage, gravity: 'center' },
				{ input: frameShape, gravity: 'center' },
				{ input: categoryIcon, gravity: 'northwest' }
			])
			.toFile(`${__dirname}/outputImage.png`);
	},
};
