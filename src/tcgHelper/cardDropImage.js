const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');
const { createCard } = require('./createCard');

module.exports = {
	async cardDropImage(numCards, cards, frames) {
		// Apply frames onto the cards
		const newCards = [];
		for (let i = 0; i < numCards; i++) {
			// newCards.push(new AttachmentBuilder(
			//     await createCard(
			//         cards[i].id + frames[i].id,
			//         cards[i].id,
			//         frames[i].id,
			//         Math.round(frames[i].cardRatio * 360 * frames[i].finalRatio),
			//         Math.round(frames[i].cardRatio * 540 * frames[i].finalRatio),
			//         frames[i].lengthShift,
			//         frames[i].widthShift,
			//     ),
			//     {name: `card${i}.png`}
			// ));
			newCards.push(await createCard(
				cards[i].id + frames[i].id,
				cards[i].id,
				frames[i].id,
				Math.round(frames[i].cardRatio * 360 * frames[i].finalRatio),
				Math.round(frames[i].cardRatio * 540 * frames[i].finalRatio),
				frames[i].lengthShift,
				frames[i].widthShift,
			));
		}

		// Create a pixel canvas and get its context, which will be used to modify the canvas
		const canvas = createCanvas(400 * numCards, 540);
		const context = canvas.getContext('2d');

		// This uses the canvas dimensions to stretch the image onto the entire canvas
		const background = await loadImage('https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		// Add the cards onto the main canvas
		for (let i = 0; i < numCards; i++) {
			const cardBuffer = await loadImage(newCards[i]);
			context.drawImage(cardBuffer, 400 * i, 0, 360, 540);
		}

		return new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'cards.png' });
	},
};
