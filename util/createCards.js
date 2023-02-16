const sharp = require('sharp');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const Jimp = require('jimp');
const { R2Upload } = require('./r2Upload');


module.exports = {
	async createCard(theme, category, url, directory, id) {
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
				}
				else if (extension === '.jpeg' || extension === '.jpg') {
					mimeType = Jimp.MIME_JPEG;
				}
				else {
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

		// Upload webp card
		const webpBuffer = await sharp(cardImage)
			.webp({ quality: 50 })
			.toBuffer();
		await R2Upload(webpBuffer, `/${directory}/webp/${id}.webp`);

		// Upload the large png version of the card
		const pngBuffer = await sharp(cardImage)
			.png({ quality: 100 })
			.toBuffer();
		R2Upload(pngBuffer, `/${directory}/png/${id}.png`);

		// Upload the large png version of the artwork
		const jpgBuffer = await sharp(imageBuffer)
			.jpeg({ quality: 100 })
			.toBuffer();
		R2Upload(jpgBuffer, `/${directory}/jpg/${id}.jpg`);
	},
};
