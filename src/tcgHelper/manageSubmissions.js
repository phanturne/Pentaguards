const { createCard } = require('../../util/createCards');
const { generateSubmissionID } = require('../../util/generateRandomID');

module.exports = {
	async createSubmission(theme, category, url) {
		// Generate a random ID for the submission
		const submissionID = await generateSubmissionID(8);

		// Create the images for the card and upload them to the submissions folder
		await createCard(theme, category, url, 'submissions', submissionID);

		return submissionID;
	},

	// APPROVE SUBMISSIONS
	// Add a card document with the info
	// Move images from /submissions

	// REJECT SUBMISSION
	// Store in rejectedSubmissions
	// Remove from submissions
};
