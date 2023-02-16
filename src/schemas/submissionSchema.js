const { Schema, model } = require('mongoose');

const submissionSchema = new Schema({
	_id: Schema.Types.ObjectId,
	id: String,
	serial: String,
	name: String,
	dateAdded: String,
	artist: String,
	artistID: String,
	rarity: { type: String, default: 'Normal' },
	theme: String,
	category: String,
	style: String,
	group: { type: String, default: 'Default' },
	aiModel: { type: String, default: 'Unknown' },
	webp: String,
	png: String,
	jpg: String,
});

module.exports = model('Submission', submissionSchema);