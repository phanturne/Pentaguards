const sharp = require('sharp');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const Jimp = require('jimp');
const { R2Upload } = require('../../util/r2Upload');
const CardSubmission = require('../schemas/cardSubmissionSchema');
const crypto = require('crypto');

// Helper function that generates a random ID
function generateRandomID(length) {
	const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let randomString = '';
	for (let i = 0; i < length; i++) {
		const randomByte = crypto.randomBytes(1);
		const randomIndex = randomByte[0] % characterSet.length;
		randomString += characterSet[randomIndex];
	}
	return randomString;
}

module.exports = {
	async createSubmission(theme, category, url) {
		// Generate a random ID for the submission
		let submissionID = generateRandomID(8);
		while (await CardSubmission.findOne({ id: submissionID })) {
			submissionID = generateRandomID(8);
		}

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
		await R2Upload(webpBuffer, `/submissions/webp/${submissionID}.webp`);

		// Upload the large png version of the card
		const pngBuffer = await sharp(cardImage)
			.png({ quality: 100 })
			.toBuffer();
		R2Upload(pngBuffer, `/submissions/png/${submissionID}.png`);

		// Upload the large png version of the artwork
		const jpgBuffer = await sharp(imageBuffer)
			.jpeg({ quality: 100 })
			.toBuffer();
		R2Upload(jpgBuffer, `/submissions/jpg/${submissionID}.jpg`);

		// Return the submission ID
		return submissionID;
	},

	// APPROVE SUBMISSIONS
	// Add a card document with the info
	// Move images from /submissions

	// REJECT SUBMISSION
	// Store in rejectedSubmissions
	// Remove from submissions
};
