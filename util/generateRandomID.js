// const crypto = require('crypto');

const CardSubmission = require('../src/schemas/cardSubmissionSchema');
module.exports = {
	async generateSubmissionID(length) {
		let submissionID;
		while (true) {
			submissionID = Math.random().toString(36).substring(0, length).toUpperCase();
			const existingCard = await CardSubmission.findOne({ id: submissionID });
			if (!existingCard) break;
		}
		return submissionID;
	},

	// function generateRandomID(length) {
	// const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	// let randomString = '';
	// for (let i = 0; i < length; i++) {
	// 	const randomByte = crypto.randomBytes(1);
	// 	const randomIndex = randomByte[0] % characterSet.length;
	// 	randomString += characterSet[randomIndex];
	// }
	// return randomString;
	// }
};